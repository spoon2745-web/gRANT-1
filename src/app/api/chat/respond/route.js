import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage, ChatResponse } from '@/models/Chat';
export async function POST(request) {
    const startTime = Date.now();
    try {
        console.log('POST /api/chat/respond - Processing response submission');
        await connectToDatabase();
        // Ensure connection is ready
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            console.log('⏳ Waiting for database connection...');
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }
        console.log('✅ Database connected, connection state:', mongoose.connection.readyState);
        const { messageId, response, supportAgent } = await request.json();
        console.log('Response data:', { messageId, response, supportAgent });
        if (!messageId || !response || !supportAgent) {
            console.log('Missing required fields');
            return NextResponse.json({ error: 'Message ID, response, and support agent are required' }, { status: 400 });
        }
        // Find the chat message (this is fast, just verification)
        const chat = await ChatMessage.findById(messageId);
        if (!chat) {
            console.log('Chat message not found:', messageId);
            return NextResponse.json({ error: 'Chat message not found' }, { status: 404 });
        }
        // Create the response document
        const responseDoc = new ChatResponse({
            messageId: messageId,
            response: response,
            staffInfo: {
                name: supportAgent,
                email: 'support@impactgrantsolutions.com', // You can customize this
                staffId: 'admin'
            },
            timestamp: new Date(),
            sentToUser: true,
            sentAt: new Date(),
            deliveryStatus: 'sent'
        });
        // Save the response document and update chat message in parallel for better performance
        const [savedResponse, updatedChat] = await Promise.all([
            responseDoc.save(),
            ChatMessage.findByIdAndUpdate(messageId, {
                $push: { responses: responseDoc._id },
                $set: {
                    status: 'responded',
                    lastActivity: new Date()
                }
            }, { new: true })
        ]);
        console.log('Response document created:', savedResponse._id);
        console.log('Response added successfully to chat:', messageId);
        const processingTime = Date.now() - startTime;
        console.log(`✅ Admin response processed in ${processingTime}ms`);
        return NextResponse.json({
            success: true,
            message: 'Response added successfully',
            processingTime: `${processingTime}ms`,
            response: {
                _id: savedResponse._id,
                message: savedResponse.response,
                timestamp: savedResponse.timestamp,
                supportAgent: savedResponse.staffInfo.name
            }
        });
    }
    catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`❌ Error in POST /api/chat/respond after ${processingTime}ms:`, error);
        return NextResponse.json({ error: 'Failed to add response' }, { status: 500 });
    }
}
