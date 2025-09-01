import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage, ChatResponse } from '@/models/Chat'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    // Ensure connection is ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve)
      })
    }
    
    const { messageId, response, staffName, staffEmail } = await request.json()

    // Verify the original message exists
    const originalMessage = await ChatMessage.findById(messageId)
    if (!originalMessage) {
      return NextResponse.json(
        { success: false, error: 'Original message not found' },
        { status: 404 }
      )
    }

    // Create response record
    const chatResponse = new ChatResponse({
      messageId: messageId,  // Use messageId to match schema
      response,
      staffInfo: {
        name: staffName,
        email: staffEmail
      },
      timestamp: new Date(),
      deliveryStatus: 'sent'
    })

    await chatResponse.save()

    // Update original message status
    await ChatMessage.findByIdAndUpdate(messageId, {
      status: 'responded',
      lastResponseAt: new Date()
    })

    // Add response to the original message's responses array
    await ChatMessage.findByIdAndUpdate(messageId, {
      $push: { responses: chatResponse._id }
    })

    return NextResponse.json({
      success: true,
      responseId: chatResponse._id,
      message: 'Response sent successfully'
    })
  } catch (error) {
    console.error('Error sending response:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send response' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const url = new URL(request.url)
    const messageId = url.searchParams.get('messageId')
    
    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Get all responses for a specific message
    const responses = await ChatResponse.find({ messageId: messageId })
      .sort({ timestamp: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      responses
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
