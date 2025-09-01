import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage } from '@/models/Chat';
export async function PATCH(request, { params }) {
    try {
        console.log('PATCH /api/chat/[id]/status - Updating message status');
        await connectToDatabase();
        const { status } = await request.json();
        const { id } = params;
        console.log('Status update data:', { id, status });
        if (!status) {
            console.log('Missing status field');
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }
        // Validate status
        const validStatuses = ['new', 'reading', 'responded', 'closed'];
        if (!validStatuses.includes(status)) {
            console.log('Invalid status:', status);
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        // Find and update the chat message
        const chat = await ChatMessage.findByIdAndUpdate(id, { status }, { new: true });
        if (!chat) {
            console.log('Chat message not found:', id);
            return NextResponse.json({ error: 'Chat message not found' }, { status: 404 });
        }
        console.log('Status updated successfully for chat:', id);
        return NextResponse.json({
            success: true,
            message: 'Status updated successfully',
            chat
        });
    }
    catch (error) {
        console.error('Error in PATCH /api/chat/[id]/status:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
