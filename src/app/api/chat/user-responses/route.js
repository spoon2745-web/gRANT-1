import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage, ChatResponse } from '@/models/Chat';
// Simple request cache to prevent duplicate requests
const requestCache = new Map();
const CACHE_DURATION = 2000; // 2 seconds cache
export async function GET(request) {
    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('sessionId');
        const lastChecked = url.searchParams.get('lastChecked');
        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
        }
        // Check cache first
        const cacheKey = `${sessionId}-${lastChecked}`;
        const cached = requestCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            return NextResponse.json(cached.data);
        }
        // Ensure MongoDB connection is fully established
        await connectToDatabase();
        // Wait for mongoose connection to be ready
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }
        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
        }
        // Find all messages for this session (exclude messages deleted for user)
        const sessionMessages = await ChatMessage.find({
            sessionId,
            deletedForUser: { $ne: true }
        })
            .populate('responses')
            .sort({ timestamp: 1 });
        // Get all responses from support staff
        let allResponses = [];
        for (const message of sessionMessages) {
            if (message.responses && message.responses.length > 0) {
                const responses = await ChatResponse.find({
                    messageId: message._id,
                    deliveryStatus: { $ne: 'delivered' } // Only get undelivered responses
                }).sort({ timestamp: 1 });
                allResponses = [...allResponses, ...responses];
            }
        }
        // Filter responses by lastChecked timestamp if provided
        let newResponses = allResponses;
        if (lastChecked) {
            const lastCheckedDate = new Date(lastChecked);
            newResponses = allResponses.filter(resp => new Date(resp.timestamp) > lastCheckedDate);
        }
        // Mark responses as delivered
        if (newResponses.length > 0) {
            const responseIds = newResponses.map(r => r._id);
            await ChatResponse.updateMany({ _id: { $in: responseIds } }, { deliveryStatus: 'delivered' });
        }
        const responseData = {
            success: true,
            newResponses,
            total: newResponses.length
        };
        // Cache the response
        requestCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
        // Clean old cache entries
        if (requestCache.size > 100) {
            const cutoff = Date.now() - CACHE_DURATION * 5;
            for (const [key, value] of requestCache.entries()) {
                if (value.timestamp < cutoff) {
                    requestCache.delete(key);
                }
            }
        }
        return NextResponse.json(responseData);
    }
    catch (error) {
        console.error('Error fetching user responses:', error);
        // If it's a MongoDB connection error, try to reconnect
        if (error instanceof Error && error.message.includes('not connected')) {
            try {
                console.log('Attempting to reconnect to MongoDB...');
                await connectToDatabase();
                return NextResponse.json({ success: false, error: 'Database connection lost. Please try again.' }, { status: 503 });
            }
            catch (reconnectError) {
                console.error('Failed to reconnect to MongoDB:', reconnectError);
            }
        }
        return NextResponse.json({ success: false, error: 'Failed to fetch responses' }, { status: 500 });
    }
}
