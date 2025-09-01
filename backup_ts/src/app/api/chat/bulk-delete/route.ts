import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage, ChatResponse, UserSession } from '@/models/Chat'

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()
    
    // Delete all chat messages, responses, and user sessions
    const messageResult = await ChatMessage.deleteMany({})
    const responseResult = await ChatResponse.deleteMany({})
    const sessionResult = await UserSession.deleteMany({})
    
    const totalDeleted = messageResult.deletedCount + responseResult.deletedCount + sessionResult.deletedCount
    
    return NextResponse.json(
      { 
        message: `All data deleted successfully. Deleted ${messageResult.deletedCount} messages, ${responseResult.deletedCount} responses, and ${sessionResult.deletedCount} sessions.`,
        deletedCount: {
          messages: messageResult.deletedCount,
          responses: responseResult.deletedCount,
          sessions: sessionResult.deletedCount,
          total: totalDeleted
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting all messages:', error)
    return NextResponse.json(
      { error: 'Failed to delete all messages' },
      { status: 500 }
    )
  }
}
