import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage, ChatResponse, UserSession } from '@/models/Chat';
import PendingNotification from '@/models/PendingNotification';
import { getSettings } from '@/lib/getSettings';

// Simple cache for GET requests to reduce database load
const getRequestCache = new Map();
const CACHE_DURATION = 15000; // 15 seconds cache for GET requests (increased for admin dashboard)

async function getTelegramCredentials() {
    const settings = await getSettings();
    return {
        TELEGRAM_BOT_TOKEN: settings?.telegramBotToken,
        TELEGRAM_CHAT_ID: settings?.telegramSupportChatId,
        BASE_URL: settings?.baseUrl
    };
}

export async function POST(request) {
    try {
        await connectToDatabase();
        // Ensure connection is ready
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }
        const data = await request.json();
        const userAgent = request.headers.get('user-agent') || undefined;
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            '127.0.0.1';
        // Generate or use existing session ID
        const sessionId = data.sessionId || generateSessionId();
        // Check if this is a reply to an existing conversation
        const existingMessages = await ChatMessage.find({ sessionId }).sort({ timestamp: -1 }).limit(1);
        if (existingMessages.length > 0 && data.sessionId) {
            // This is a user reply to an existing conversation
            const originalMessage = existingMessages[0];
            // Create a user response (similar to support responses but from user)
            const userResponse = new ChatResponse({
                response: data.message,
                messageId: originalMessage._id,
                timestamp: new Date(data.timestamp),
                staffInfo: {
                    name: data.userInfo.name,
                    email: data.userInfo.email,
                    role: 'user' // Mark as user response
                },
                deliveryStatus: 'delivered'
            });
            await userResponse.save();
            // Update the original message's responses array and status
            await ChatMessage.findByIdAndUpdate(originalMessage._id, {
                $push: { responses: userResponse._id },
                $set: {
                    status: 'user-replied',
                    lastActivity: new Date()
                }
            });
            // Update user session
            await UserSession.findOneAndUpdate({ sessionId }, {
                $set: {
                    userInfo: data.userInfo,
                    lastActivity: new Date(),
                    userAgent,
                    ipAddress
                },
                $inc: { messageCount: 1 }
            }, { upsert: true, new: true });
            // Send Telegram notification for user replies (async, non-blocking)
            sendTelegramNotification({
                priority: determinePriority(data.message),
                userInfo: data.userInfo,
                message: data.message,
                timestamp: new Date(data.timestamp)
            }, sessionId, request, true // isReply flag
            );
            return NextResponse.json({
                success: true,
                messageId: originalMessage._id,
                responseId: userResponse._id,
                sessionId,
                type: 'user_reply',
                message: 'User reply added to existing conversation'
            });
        }
        else {
            // This is a new conversation - create new ChatMessage
            // Create or update user session
            await UserSession.findOneAndUpdate({ sessionId }, {
                $set: {
                    userInfo: data.userInfo,
                    lastActivity: new Date(),
                    userAgent,
                    ipAddress
                },
                $inc: { messageCount: 1 }
            }, { upsert: true, new: true });
            // Create new chat message
            const chatMessage = new ChatMessage({
                message: data.message,
                userInfo: data.userInfo,
                timestamp: new Date(data.timestamp),
                sessionId,
                userAgent,
                ipAddress,
                status: 'new',
                priority: determinePriority(data.message)
            });
            await chatMessage.save();
            // Send Telegram notification for new conversations (async, non-blocking)
            sendTelegramNotification(chatMessage, sessionId, request, false);
            return NextResponse.json({
                success: true,
                messageId: chatMessage._id,
                sessionId,
                type: 'new_conversation',
                message: 'New conversation started'
            });
        }
    }
    catch (error) {
        console.error('Error processing chat message:', error);
        return NextResponse.json({ success: false, error: 'Failed to process message' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const isDev = process.env.NODE_ENV === 'development';
        const enableApiLogs = process.env.ENABLE_API_LOGS === 'true';
        const showLogs = isDev && enableApiLogs;
        if (showLogs)
            console.log('🚀 GET /api/chat - Fetching chat messages...');
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const status = url.searchParams.get('status') || undefined;
        const sessionId = url.searchParams.get('sessionId') || undefined;
        // Check cache first for admin dashboard requests (no sessionId)
        if (!sessionId) {
            const cacheKey = `admin-${limit}-${status}`;
            const cached = getRequestCache.get(cacheKey);
            if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
                if (showLogs)
                    console.log('📱 Serving from cache:', cacheKey);
                return NextResponse.json(cached.data);
            }
        }
        await connectToDatabase();
        // Ensure connection is ready
        if (mongoose.connection.readyState !== 1) {
            if (showLogs)
                console.log('⏳ Waiting for database connection...');
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }
        if (showLogs)
            console.log('✅ Database connected, connection state:', mongoose.connection.readyState);
        if (showLogs)
            console.log('🔍 Query parameters:', { limit, status, sessionId });
        // Build query
        const query = {};
        if (status)
            query.status = status;
        if (sessionId) {
            query.sessionId = sessionId;
            // For user sessions, filter out messages deleted for user
            query.deletedForUser = { $ne: true };
        }
        else {
            // For admin requests, filter out messages deleted for admin
            query.deletedForAdmin = { $ne: true };
        }
        if (showLogs)
            console.log('📋 MongoDB query:', query);
        // Get messages with pagination and populate responses (filtering deleted ones)
        const populateQuery = sessionId
            ? { path: 'responses', match: { deletedForUser: { $ne: true } } } // For users, hide responses deleted for user
            : { path: 'responses', match: { deletedForAdmin: { $ne: true } } }; // For admin, hide responses deleted for admin
        const messages = await ChatMessage.find(query)
            .populate(populateQuery)
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();
        if (showLogs)
            console.log('💬 Found messages:', messages.length);
        // Transform the responses to match frontend interface
        const transformedMessages = messages.map(message => ({
            ...message,
            responses: message.responses ? message.responses.map((response) => ({
                message: response.response, // Map 'response' field to 'message' for frontend
                timestamp: response.timestamp,
                supportAgent: response.staffInfo?.name || 'Support Agent',
                isUserReply: response.staffInfo?.role === 'user', // Mark user replies
                userInfo: response.staffInfo?.role === 'user' ? {
                    name: response.staffInfo.name,
                    email: response.staffInfo.email
                } : undefined
            })) : []
        }));
        if (showLogs && transformedMessages[0]) {
            console.log('📋 Sample message with responses:', {
                id: transformedMessages[0]._id,
                message: transformedMessages[0].message?.substring(0, 50) + '...',
                userInfo: transformedMessages[0].userInfo,
                status: transformedMessages[0].status,
                responseCount: transformedMessages[0].responses?.length || 0,
                sampleResponse: transformedMessages[0].responses?.[0] ? {
                    message: transformedMessages[0].responses[0].message?.substring(0, 30) + '...',
                    isUserReply: transformedMessages[0].responses[0].isUserReply,
                    supportAgent: transformedMessages[0].responses[0].supportAgent,
                    staffRole: transformedMessages[0].responses[0].isUserReply ? 'user' : 'support'
                } : 'No responses'
            });
        }
        // Get total count
        const total = await ChatMessage.countDocuments(query);
        if (showLogs)
            console.log('📊 Total count:', total);
        // Get session stats
        const sessionStats = await UserSession.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, totalSessions: { $sum: 1 }, totalMessages: { $sum: '$messageCount' } } }
        ]);
        const responseData = {
            chats: transformedMessages.reverse(), // Show oldest first and use "chats" key to match frontend
            messages: transformedMessages.reverse(), // Keep both for backward compatibility
            total,
            stats: sessionStats[0] || { totalSessions: 0, totalMessages: 0 }
        };
        // Cache admin dashboard responses to reduce database load
        if (!sessionId) {
            const cacheKey = `admin-${limit}-${status}`;
            getRequestCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
            // Clean old cache entries
            if (getRequestCache.size > 50) {
                const cutoff = Date.now() - CACHE_DURATION * 5;
                for (const [key, value] of getRequestCache.entries()) {
                    if (value.timestamp < cutoff) {
                        getRequestCache.delete(key);
                    }
                }
            }
        }
        if (showLogs)
            console.log('📤 Sending response with', responseData.chats.length, 'chats');
        return NextResponse.json(responseData);
    }
    catch (error) {
        console.error('Error fetching chat messages:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectToDatabase();
        // Ensure connection is ready
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }
        const { messageId, status } = await request.json();
        const updatedMessage = await ChatMessage.findByIdAndUpdate(messageId, { status }, { new: true });
        if (!updatedMessage) {
            return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Message status updated',
            updatedMessage
        });
    }
    catch (error) {
        console.error('Error updating message status:', error);
        return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
    }
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function determinePriority(message) {
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical'];
    const highKeywords = ['important', 'deadline', 'soon', 'help', 'problem', 'issue', 'error'];
    const lowerMessage = message.toLowerCase();
    if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return 'urgent';
    }
    if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return 'high';
    }
    if (message.length > 500) {
        return 'medium';
    }
    return 'low';
}

async function sendTelegramNotification(chatMessage, sessionId, request, isReply = false) {
    // Send notification asynchronously without blocking the main response
    setImmediate(async () => {
        try {
            const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, BASE_URL } = await getTelegramCredentials();

            if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
                console.warn('Telegram credentials not configured');
                return;
            }

            const baseUrl = BASE_URL || `http://${request.headers.get('host')}`;

            const priorityEmoji = {
                urgent: '🚨',
                high: '⚡',
                medium: '📌',
                low: '💬'
            };
            const messageType = isReply ? 'User Reply' : 'New Support Chat Message';
            const typeEmoji = isReply ? '↩️' : '🆕';
            const message = `
${typeEmoji} ${priorityEmoji[chatMessage.priority]} *${messageType}*

👤 *User:* ${chatMessage.userInfo.name}
📧 *Email:* ${chatMessage.userInfo.email}
🆔 *Session:* 
${sessionId}
📱 *Priority:* ${chatMessage.priority.toUpperCase()}
🕐 *Time:* ${chatMessage.timestamp.toLocaleString()}

💬 *Message:*
${chatMessage.message}

---
[View in Dashboard](${baseUrl}/support?session=${sessionId})
`;
            // Use a fetch helper with AbortController so timeouts are explicit and compatible
            const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeoutMs);
                try {
                    return await fetch(url, { ...options, signal: controller.signal });
                }
                finally {
                    clearTimeout(id);
                }
            };

            // Retry logic with exponential backoff and jitter
            const maxAttempts = 3;
            let attempt = 0;
            let lastError = null;
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const payload = {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            };

            while (++attempt <= maxAttempts) {
                try {
                    const resp = await fetchWithTimeout(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }, 15000);

                    if (!resp.ok) {
                        const text = await resp.text().catch(() => resp.statusText || 'unknown');
                        throw new Error(`Telegram API error (${resp.status}): ${text}`);
                    }

                    console.log('Telegram notification sent successfully (attempt', attempt + ')');
                    lastError = null;
                    break; // success
                }
                catch (err) {
                    lastError = err;
                    console.error(`Telegram attempt ${attempt} failed:`, err && err.message ? err.message : err);
                    // If we've exhausted attempts, log and give up
                    if (attempt >= maxAttempts) {
                        console.error('All Telegram attempts failed:', lastError);
                        try {
                            // Persist pending notification for retry
                            await PendingNotification.create({
                                chatMessageId: chatMessage._id || null,
                                sessionId,
                                payload,
                                lastError: lastError && lastError.message ? lastError.message : String(lastError),
                                attempts: attempt,
                                nextAttemptAt: new Date(Date.now() + 1000 * 60 * 5) // retry in 5 minutes
                            });
                        }
                        catch (persistErr) {
                            console.error('Failed to persist pending Telegram notification:', persistErr);
                        }
                        break;
                    }
                    // Backoff with jitter: base 500ms * 2^(attempt-1) plus up to 300ms random
                    const backoff = Math.min(10000, 500 * (2 ** (attempt - 1))) + Math.floor(Math.random() * 300);
                    await new Promise(res => setTimeout(res, backoff));
                }
            }
        }
        catch (error) {
            console.error('Failed to send Telegram notification:', error);
            // Don't throw - notifications should never block the main chat functionality
        }
    });
}
