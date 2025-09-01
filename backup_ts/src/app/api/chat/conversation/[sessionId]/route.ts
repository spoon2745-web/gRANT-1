import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage } from '@/models/Chat'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectToDatabase()
    
    const sessionId = params.sessionId
    
    // Delete all messages for this session
    const result = await ChatMessage.deleteMany({ sessionId })
    
    return NextResponse.json(
      { 
        message: `Conversation cleared successfully. Deleted ${result.deletedCount} messages.`,
        deletedCount: result.deletedCount 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error clearing conversation:', error)
    return NextResponse.json(
      { error: 'Failed to clear conversation' },
      { status: 500 }
    )
  }
}
