import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { ChatMessage, ChatResponse } from '@/models/Chat'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const responseId = params.id
    const body = await request.json()
    const { deleteType, staffInfo } = body
    
    if (!deleteType || !['admin-only', 'both'].includes(deleteType)) {
      return NextResponse.json(
        { error: 'Invalid delete type. Must be "admin-only" or "both"' },
        { status: 400 }
      )
    }

    // Find the response
    const response = await ChatResponse.findById(responseId)
    
    if (!response) {
      return NextResponse.json(
        { error: 'Response not found' },
        { status: 404 }
      )
    }

    // Update deletion fields based on type
    const updateFields: any = {
      deletedBy: {
        staffId: staffInfo.id || 'admin',
        staffName: staffInfo.name,
        deletedAt: new Date(),
        deleteType
      }
    }

    if (deleteType === 'admin-only') {
      updateFields.deletedForAdmin = true
    } else if (deleteType === 'both') {
      updateFields.deletedForAdmin = true
      updateFields.deletedForUser = true
    }

    // Update the response
    const updatedResponse = await ChatResponse.findByIdAndUpdate(
      responseId,
      updateFields,
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: `Response ${deleteType === 'admin-only' ? 'hidden from admin view' : 'deleted for both admin and user'}`,
      deleteType,
      updatedResponse
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing response deletion:', error)
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    )
  }
}

// Permanent delete for responses
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const responseId = params.id
    
    // Find and delete the response
    const deletedResponse = await ChatResponse.findByIdAndDelete(responseId)
    
    if (!deletedResponse) {
      return NextResponse.json(
        { error: 'Response not found' },
        { status: 404 }
      )
    }

    // Remove the response from the original message's responses array
    await ChatMessage.findByIdAndUpdate(
      deletedResponse.messageId,
      { $pull: { responses: responseId } }
    )

    return NextResponse.json({
      success: true,
      message: 'Response deleted permanently',
      deletedResponse
    }, { status: 200 })

  } catch (error) {
    console.error('Error deleting response:', error)
    return NextResponse.json(
      { error: 'Failed to delete response' },
      { status: 500 }
    )
  }
}
