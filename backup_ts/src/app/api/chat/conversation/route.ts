import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage, ChatResponse } from '@/models/Chat'

interface TimelineItem {
  id: string
  type: 'user_message' | 'staff_response'
  content: string
  timestamp: Date
  userInfo?: {
    name: string
    email: string
  }
  staffInfo?: {
    name: string
    email: string
  }
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'new' | 'reading' | 'responded' | 'closed'
  deliveryStatus?: 'sent' | 'delivered' | 'read'
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    // Ensure connection is ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve)
      })
    }
    
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Get all messages for this session
    const messages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 }) // Oldest first for chat order
      .lean()

    // Get all responses for this session
    const responses = await ChatResponse.find({ 
      messageId: { $in: messages.map(m => m._id) }
    })
      .sort({ timestamp: 1 })
      .lean()

    // Create a timeline by merging messages and responses
    const timeline: TimelineItem[] = []
    
    // Add all user messages
    messages.forEach(message => {
      timeline.push({
        id: (message._id as any).toString(),
        type: 'user_message',
        content: message.message,
        userInfo: message.userInfo,
        timestamp: message.timestamp,
        priority: message.priority,
        status: message.status
      })
    })

    // Add all staff responses
    responses.forEach(response => {
      timeline.push({
        id: (response._id as any).toString(),
        type: 'staff_response',
        content: response.response,
        staffInfo: response.staffInfo,
        timestamp: response.timestamp,
        deliveryStatus: response.deliveryStatus
      })
    })

    // Sort by timestamp to create proper conversation flow
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json({
      success: true,
      sessionId,
      timeline,
      messageCount: messages.length,
      responseCount: responses.length
    })
  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversation history' },
      { status: 500 }
    )
  }
}
