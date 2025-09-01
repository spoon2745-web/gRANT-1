import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage } from '@/models/Chat';
export async function PATCH(request, { params }) {
    try {
        await connectToDatabase();
        const messageId = params.id;
        const body = await request.json();
        const { deleteType, staffInfo } = body;
        if (!deleteType || !['admin-only', 'both'].includes(deleteType)) {
            return NextResponse.json({ error: 'Invalid delete type. Must be "admin-only" or "both"' }, { status: 400 });
        }
        if (!staffInfo || !staffInfo.name) {
            return NextResponse.json({ error: 'Staff information is required' }, { status: 400 });
        }
        // Find the message
        const message = await ChatMessage.findById(messageId);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        // Update deletion fields based on type
        const updateFields = {
            deletedBy: {
                staffId: staffInfo.id || 'admin',
                staffName: staffInfo.name,
                deletedAt: new Date(),
                deleteType
            }
        };
        if (deleteType === 'admin-only') {
            updateFields.deletedForAdmin = true;
        }
        else if (deleteType === 'both') {
            updateFields.deletedForAdmin = true;
            updateFields.deletedForUser = true;
        }
        // Update the message
        const updatedMessage = await ChatMessage.findByIdAndUpdate(messageId, updateFields, { new: true });
        return NextResponse.json({
            success: true,
            message: `Message ${deleteType === 'admin-only' ? 'hidden from admin view' : 'deleted for both admin and user'}`,
            deleteType,
            updatedMessage
        }, { status: 200 });
    }
    catch (error) {
        console.error('Error processing selective deletion:', error);
        return NextResponse.json({ error: 'Failed to process deletion request' }, { status: 500 });
    }
}
// Endpoint to restore messages (undo deletion)
export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const messageId = params.id;
        const body = await request.json();
        const { restoreFor, staffInfo } = body;
        if (!restoreFor || !['admin', 'both'].includes(restoreFor)) {
            return NextResponse.json({ error: 'Invalid restore type. Must be "admin" or "both"' }, { status: 400 });
        }
        // Find the message
        const message = await ChatMessage.findById(messageId);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        // Update restoration fields
        const updateFields = {};
        if (restoreFor === 'admin') {
            updateFields.deletedForAdmin = false;
        }
        else if (restoreFor === 'both') {
            updateFields.deletedForAdmin = false;
            updateFields.deletedForUser = false;
            updateFields.deletedBy = null;
        }
        // Update the message
        const updatedMessage = await ChatMessage.findByIdAndUpdate(messageId, updateFields, { new: true });
        return NextResponse.json({
            success: true,
            message: `Message restored for ${restoreFor}`,
            restoreFor,
            updatedMessage
        }, { status: 200 });
    }
    catch (error) {
        console.error('Error restoring message:', error);
        return NextResponse.json({ error: 'Failed to restore message' }, { status: 500 });
    }
}
