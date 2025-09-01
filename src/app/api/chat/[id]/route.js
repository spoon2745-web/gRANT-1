import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ChatMessage } from '@/models/Chat';
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const messageId = params.id;
        // Find and delete the specific message
        const deletedMessage = await ChatMessage.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Message deleted successfully', deletedMessage }, { status: 200 });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
