import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage, UserSession } from '@/models/Chat'

// Update user presence status
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { sessionId, isOnline, action } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update user session
    const session = await UserSession.findOneAndUpdate(
      { sessionId },
      { 
        lastActivity: new Date(),
        isActive: isOnline !== false
      },
      { new: true, upsert: true }
    )

    // Update all messages in this session
    await ChatMessage.updateMany(
      { sessionId },
      { 
        userOnline: isOnline !== false,
        userLastSeen: new Date(),
        lastActivity: new Date()
      }
    )

    // Handle specific actions
    switch (action) {
      case 'typing':
        // User is typing - could be used for typing indicators
        await ChatMessage.updateMany(
          { sessionId },
          { 
            $set: { 
              'userActivity.typing': true,
              'userActivity.lastTyping': new Date()
            }
          }
        )
        break
        
      case 'stop_typing':
        await ChatMessage.updateMany(
          { sessionId },
          { 
            $unset: { 'userActivity.typing': 1 }
          }
        )
        break
        
      case 'reading':
        // User is reading messages
        await ChatMessage.updateMany(
          { sessionId },
          { 
            $set: { 
              'userActivity.reading': true,
              'userActivity.lastReading': new Date()
            }
          }
        )
        break
    }

    return NextResponse.json({
      success: true,
      message: 'Presence updated successfully',
      session: {
        sessionId: session.sessionId,
        isActive: session.isActive,
        lastActivity: session.lastActivity
      }
    })

  } catch (error) {
    console.error('Error updating presence:', error)
    return NextResponse.json(
      { error: 'Failed to update presence' },
      { status: 500 }
    )
  }
}

// Get presence information for sessions
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const url = new URL(request.url)
    const sessionIds = url.searchParams.get('sessionIds')?.split(',') || []
    
    if (sessionIds.length === 0) {
      return NextResponse.json({ presence: [] })
    }

    // Get session presence info
    const sessions = await UserSession.find(
      { sessionId: { $in: sessionIds } }
    ).select('sessionId isActive lastActivity')

    // Get message-level presence info
    const messages = await ChatMessage.find(
      { sessionId: { $in: sessionIds } }
    ).select('sessionId userOnline userLastSeen userActivity')
    .sort({ timestamp: -1 })

    // Combine presence data by session
    const presenceMap = new Map()
    
    sessions.forEach(session => {
      presenceMap.set(session.sessionId, {
        sessionId: session.sessionId,
        isActive: session.isActive,
        lastActivity: session.lastActivity,
        userOnline: false,
        userLastSeen: session.lastActivity
      })
    })

    messages.forEach(msg => {
      if (presenceMap.has(msg.sessionId)) {
        const existing = presenceMap.get(msg.sessionId)
        presenceMap.set(msg.sessionId, {
          ...existing,
          userOnline: msg.userOnline || existing.userOnline,
          userLastSeen: msg.userLastSeen || existing.userLastSeen,
          userActivity: msg.userActivity
        })
      }
    })

    return NextResponse.json({
      success: true,
      presence: Array.from(presenceMap.values()),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching presence:', error)
    return NextResponse.json(
      { error: 'Failed to fetch presence' },
      { status: 500 }
    )
  }
}
