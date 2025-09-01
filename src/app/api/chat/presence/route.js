import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage, UserSession } from '@/models/Chat';

// Simple cache for GET requests to reduce database load
const getRequestCache = new Map();
const CACHE_DURATION = 3000; // 3 seconds cache for GET requests

// Update user presence status
export async function POST(request) {
    try {
        await connectToDatabase();
        const { sessionId, isOnline, action } = await request.json();
        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }
        // Update user session
        const session = await UserSession.findOneAndUpdate({ sessionId }, {
            lastActivity: new Date(),
            isActive: isOnline !== false
        }, { new: true, upsert: true });
        // Update all messages in this session
        await ChatMessage.updateMany({ sessionId }, {
            userOnline: isOnline !== false,
            userLastSeen: new Date(),
            lastActivity: new Date()
        });
        // Handle specific actions
        switch (action) {
            case 'typing':
                // User is typing - could be used for typing indicators
                await ChatMessage.updateMany({ sessionId }, {
                    $set: {
                        'userActivity.typing': true,
                        'userActivity.lastTyping': new Date()
                    }
                });
                break;
            case 'stop_typing':
                await ChatMessage.updateMany({ sessionId }, {
                    $unset: { 'userActivity.typing': 1 }
                });
                break;
            case 'reading':
                // User is reading messages
                await ChatMessage.updateMany({ sessionId }, {
                    $set: {
                        'userActivity.reading': true,
                        'userActivity.lastReading': new Date()
                    }
                });
                break;
        }
        return NextResponse.json({
            success: true,
            message: 'Presence updated successfully',
            session: {
                sessionId: session.sessionId,
                isActive: session.isActive,
                lastActivity: session.lastActivity
            }
        });
    }
    catch (error) {
        console.error('Error updating presence:', error);
        return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
    }
}
// Get presence information for sessions
export async function GET(request) {
    try {
        await connectToDatabase();
        const url = new URL(request.url);
        const sessionIds = url.searchParams.get('sessionIds')?.split(',') || [];
        if (sessionIds.length === 0) {
            return NextResponse.json({ presence: [] });
        }
        // Get session presence info
        const sessions = await UserSession.find({ sessionId: { $in: sessionIds } }).select('sessionId isActive lastActivity');
        // Get message-level presence info
        const messages = await ChatMessage.find({ sessionId: { $in: sessionIds } }).select('sessionId userOnline userLastSeen userActivity')
            .sort({ timestamp: -1 });
        // Combine presence data by session
        const presenceMap = new Map();
        sessions.forEach(session => {
            presenceMap.set(session.sessionId, {
                sessionId: session.sessionId,
                isActive: session.isActive,
                lastActivity: session.lastActivity,
                userOnline: false,
                userLastSeen: session.lastActivity
            });
        });
        messages.forEach(msg => {
            if (presenceMap.has(msg.sessionId)) {
                const existing = presenceMap.get(msg.sessionId);
                presenceMap.set(msg.sessionId, {
                    ...existing,
                    userOnline: msg.userOnline || existing.userOnline,
                    userLastSeen: msg.userLastSeen || existing.userLastSeen,
                    userActivity: msg.userActivity
                });
            }
        });
        // Check cache first
        const cacheKey = `presence-${sessionIds.join('-')}`;
        const cached = getRequestCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            return NextResponse.json(cached.data);
        }

        // ... (rest of your existing code)

        const responseData = {
            success: true,
            presence: Array.from(presenceMap.values()),
            timestamp: new Date().toISOString()
        };

        // Cache the response
        getRequestCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
        // Clean old cache entries (optional, but good practice)
        if (getRequestCache.size > 100) { // Limit cache size
            const cutoff = Date.now() - CACHE_DURATION * 5;
            for (const [key, value] of getRequestCache.entries()) {
                if (value.timestamp < cutoff) {
                    getRequestCache.delete(key);
                }
            }
        }

        return NextResponse.json(responseData);
    }
    catch (error) {
        console.error('Error fetching presence:', error);
        return NextResponse.json({ error: 'Failed to fetch presence' }, { status: 500 });
    }
}
