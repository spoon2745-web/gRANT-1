import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage } from '@/models/Chat'

// Update chat status and read receipts
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { messageId, action, staffInfo } = await request.json()
    
    if (!messageId || !action) {
      return NextResponse.json(
        { error: 'Message ID and action are required' },
        { status: 400 }
      )
    }

    const chat = await ChatMessage.findById(messageId)
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat message not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'mark_read':
        // Mark message as read by staff
        if (staffInfo) {
          const existingRead = chat.readBy?.find(
            (read: any) => read.staffId === staffInfo.staffId
          )
          
          if (!existingRead) {
            chat.readBy = chat.readBy || []
            chat.readBy.push({
              staffId: staffInfo.staffId,
              staffName: staffInfo.name,
              readAt: new Date()
            })
          }
        }
        chat.isRead = true
        break

      case 'assign':
        // Assign conversation to staff member
        if (staffInfo) {
          chat.assignedTo = {
            staffId: staffInfo.staffId,
            staffName: staffInfo.name,
            assignedAt: new Date()
          }
          chat.status = 'reading'
        }
        break

      case 'update_status':
        // Update conversation status
        const { status } = await request.json()
        if (['new', 'reading', 'responded', 'closed'].includes(status)) {
          chat.status = status
        }
        break

      case 'typing':
        // Update typing indicator (handled in real-time via WebSocket in future)
        // For now, just update last activity
        chat.lastActivity = new Date()
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    chat.lastActivity = new Date()
    await chat.save()

    return NextResponse.json({
      success: true,
      message: `Action ${action} completed successfully`,
      chat: {
        _id: chat._id,
        status: chat.status,
        isRead: chat.isRead,
        readBy: chat.readBy,
        assignedTo: chat.assignedTo,
        lastActivity: chat.lastActivity
      }
    })

  } catch (error) {
    console.error('Error updating chat status:', error)
    return NextResponse.json(
      { error: 'Failed to update chat status' },
      { status: 500 }
    )
  }
}

// Get real-time status updates for multiple chats
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const url = new URL(request.url)
    const sessionIds = url.searchParams.get('sessionIds')?.split(',') || []
    const lastChecked = url.searchParams.get('lastChecked')
    
    if (sessionIds.length === 0) {
      return NextResponse.json({ updates: [] })
    }

    let query: any = { sessionId: { $in: sessionIds } }
    
    if (lastChecked) {
      query.lastActivity = { $gt: new Date(lastChecked) }
    }

    const updates = await ChatMessage.find(query)
      .select('_id sessionId status isRead readBy assignedTo lastActivity userOnline userLastSeen')
      .sort({ lastActivity: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      updates: updates,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching status updates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status updates' },
      { status: 500 }
    )
  }
}
