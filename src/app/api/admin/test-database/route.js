import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
export async function POST(request) {
    try {
        const { mongodbUri } = await request.json();
        if (!mongodbUri) {
            return NextResponse.json({ success: false, error: 'MongoDB URI is required' }, { status: 400 });
        }
        // Close existing connection if any
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        // Test connection
        const connection = await mongoose.connect(mongodbUri, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        // Get database info
        const db = connection.connection.db;
        if (!db) {
            throw new Error('Database connection failed');
        }
        const admin = db.admin();
        const serverStatus = await admin.serverStatus();
        // Test a simple operation
        const collections = await db.listCollections().toArray();
        // Disconnect test connection
        await mongoose.disconnect();
        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            info: {
                host: serverStatus.host,
                version: serverStatus.version,
                collections: collections.length,
                uptime: Math.round(serverStatus.uptime / 3600) + ' hours'
            }
        });
    }
    catch (error) {
        // Ensure we disconnect on error
        try {
            await mongoose.disconnect();
        }
        catch { }
        console.error('Database connection test failed:', error);
        let errorMessage = 'Database connection failed';
        if (error.name === 'MongoServerSelectionError') {
            errorMessage = 'Cannot connect to MongoDB server. Check your URI and network connection.';
        }
        else if (error.name === 'MongoParseError') {
            errorMessage = 'Invalid MongoDB URI format.';
        }
        else if (error.message) {
            errorMessage = error.message;
        }
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
