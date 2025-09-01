'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DoubleConfirmDialog } from '@/components/ui/double-confirm-dialog'

interface ChatMessage {
  _id: string
  message: string
  userInfo: {
    name: string
    email: string
  }
  timestamp: string
  sessionId: string
  status: 'new' | 'reading' | 'responded' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  responses?: ChatResponse[]
  userAgent?: string
  ipAddress?: string
}

interface ChatResponse {
  message: string
  timestamp: string
  supportAgent: string
}

export default function SupportDashboard() {
  const [chats, setChats] = useState<ChatMessage[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'responded' | 'closed'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
  const [responseText, setResponseText] = useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)
  const { success, error } = useToast()

  // Dialog states
  const [deleteMessageDialog, setDeleteMessageDialog] = useState<{ open: boolean; messageId?: string }>({ open: false })
  const [clearConversationDialog, setClearConversationDialog] = useState<{ open: boolean; sessionId?: string }>({ open: false })
  const [deleteAllDialog, setDeleteAllDialog] = useState(false)

  const fetchChats = useCallback(async () => {
    try {
      console.log('🔍 Fetching chats from /api/chat...')
      const response = await fetch('/api/chat')
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📋 Raw API response:', data)
        console.log('💬 Chat messages array:', data.chats)
        console.log('📊 Number of chats:', data.chats?.length || 0)
        
        if (data.chats && Array.isArray(data.chats)) {
          console.log('✅ Setting chats state with', data.chats.length, 'messages')
          setChats(data.chats)
        } else {
          console.log('⚠️ No chats array found in response, setting empty array')
          setChats([])
        }
      } else {
        console.error('❌ Response not OK:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Error response body:', errorText)
        error('Error', `${response.status} ${response.statusText}`)
      }
    } catch (err) {
      console.error('💥 Error fetching chats:', err)
      error('Error', 'Error loading chat messages')
    }
  }, [error])

  useEffect(() => {
    fetchChats()
    const interval = setInterval(fetchChats, 30000)
    return () => clearInterval(interval)
  }, [fetchChats])

  const deleteMessage = async (messageId: string) => {
    setDeleteMessageDialog({ open: true, messageId })
  }

  const confirmDeleteMessage = async () => {
    const messageId = deleteMessageDialog.messageId
    if (!messageId) return

    try {
      const response = await fetch(`/api/chat/${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        success('Success', 'Message deleted successfully')
        setSelectedMessage(null)
        fetchChats()
      } else {
        throw new Error('Failed to delete message')
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      error('Error', 'Error deleting message')
    } finally {
      setDeleteMessageDialog({ open: false })
    }
  }

  const clearConversation = async (sessionId: string) => {
    setClearConversationDialog({ open: true, sessionId })
  }

  const confirmClearConversation = async () => {
    const sessionId = clearConversationDialog.sessionId
    if (!sessionId) return

    try {
      const response = await fetch(`/api/chat/conversation/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        success('Success', 'Conversation cleared successfully')
        setSelectedMessage(null)
        fetchChats()
      } else {
        throw new Error('Failed to clear conversation')
      }
    } catch (err) {
      console.error('Error clearing conversation:', err)
      error('Error', 'Error clearing conversation')
    } finally {
      setClearConversationDialog({ open: false })
    }
  }

  const deleteAllMessages = async () => {
    setDeleteAllDialog(true)
  }

  const confirmDeleteAllMessages = async () => {
    try {
      const response = await fetch('/api/chat/bulk-delete', {
        method: 'DELETE',
      })

      if (response.ok) {
        success('Success', 'All messages deleted successfully')
        setSelectedMessage(null)
        setChats([])
      } else {
        throw new Error('Failed to delete all messages')
      }
    } catch (err) {
      console.error('Error deleting all messages:', err)
      error('Error', 'Error deleting all messages')
    } finally {
      setDeleteAllDialog(false)
    }
  }

  const submitResponse = async () => {
    if (!selectedMessage || !responseText.trim()) {
      error('Error', 'Please enter a response message')
      return
    }

    setIsSubmittingResponse(true)

    try {
      console.log('🚀 Submitting response for message:', selectedMessage._id)
      console.log('📝 Response text:', responseText)
      
      const requestBody = {
        messageId: selectedMessage._id,
        response: responseText.trim(),
        supportAgent: 'Support Agent', // You can customize this
      }
      
      console.log('📤 Request body:', requestBody)
      
      const response = await fetch('/api/chat/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📡 Response status:', response.status, response.statusText)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('✅ Response successful:', responseData)
        success('Success', 'Response sent successfully')
        setResponseText('')
        fetchChats() // Refresh to show the new response
      } else {
        const errorData = await response.text()
        console.error('❌ Response failed:', response.status, response.statusText, errorData)
        throw new Error(`Failed to send response: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      console.error('💥 Error sending response:', err)
      error('Error', `Error sending response: ${err.message}`)
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  const updateMessageStatus = async (messageId: string, newStatus: 'new' | 'reading' | 'responded' | 'closed') => {
    try {
      const response = await fetch(`/api/chat/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        success('Success', `Message marked as ${newStatus}`)
        fetchChats()
      } else {
        throw new Error('Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      error('Error', 'Error updating message status')
    }
  }

  const filteredChats = chats.filter(chat => {
    if (filter === 'all') return true
    return chat.status === filter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200'
      case 'reading': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'responded': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Support Dashboard - Chat Interface</h1>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-4">
              {(['all', 'new', 'responded', 'closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {status} ({status === 'all' ? chats.length : chats.filter(c => c.status === status).length})
                </button>
              ))}
            </div>

            {/* Management Toolbar */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Chat Management</span>
                <span className="text-sm text-gray-600">
                  Total: {chats.length} | New: {chats.filter(c => c.status === 'new').length}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => fetchChats()}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Refresh
                </button>
                <button
                  onClick={deleteAllMessages}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Conversation List */}
            <div className="lg:col-span-1 border-r bg-gray-50 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Conversations ({filteredChats.length})
              </h2>
              
              {filteredChats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>No conversations found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedMessage(chat)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedMessage?._id === chat._id
                          ? 'bg-blue-100 border-blue-300 shadow-sm'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-sm font-medium">
                            {chat.userInfo.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 text-sm truncate">
                              {chat.userInfo.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(chat.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(chat.status)}`}>
                              {chat.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(chat.priority)}`}>
                              {chat.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {chat.message}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span className="truncate">{chat.userInfo.email}</span>
                        {chat.responses && chat.responses.length > 0 && (
                          <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full ml-2">
                            {chat.responses.length} reply
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Conversation View */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="flex flex-col h-[600px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {selectedMessage.userInfo.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{selectedMessage.userInfo.name}</h3>
                          <p className="text-sm text-gray-600">{selectedMessage.userInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedMessage.status)}`}>
                          {selectedMessage.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(selectedMessage.priority)}`}>
                          {selectedMessage.priority}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Update Controls */}
                    <div className="flex space-x-2">
                      {(['reading', 'responded', 'closed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateMessageStatus(selectedMessage._id, status)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                            selectedMessage.status === status
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Mark as {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {/* Initial User Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[70%]">
                        <div className="bg-white rounded-lg p-3 shadow-sm border">
                          <p className="text-gray-800">{selectedMessage.message}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-1">
                          {selectedMessage.userInfo.name} • {formatDate(selectedMessage.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Support Responses */}
                    {selectedMessage.responses && selectedMessage.responses.length > 0 && (
                      selectedMessage.responses.map((response, index) => (
                        <div key={index} className="flex justify-end">
                          <div className="max-w-[70%]">
                            <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm">
                              <p>{response.message}</p>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 px-1 text-right">
                              {response.supportAgent} • {formatDate(response.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {/* Scroll to bottom indicator */}
                    <div className="h-1"></div>
                  </div>

                  {/* Response Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your response here..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                              e.preventDefault()
                              submitResponse()
                            }
                          }}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Press Ctrl+Enter to send quickly
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={submitResponse}
                          disabled={isSubmittingResponse || !responseText.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {isSubmittingResponse ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Send
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setResponseText('')}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <div className="text-xs text-gray-500">
                        Session: {selectedMessage.sessionId.slice(-8)} • Last activity: {formatDate(selectedMessage.timestamp)}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteMessage(selectedMessage._id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => clearConversation(selectedMessage.sessionId)}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-xs"
                        >
                          Clear Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a conversation from the left to view the chat history and respond</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Message Dialog */}
      <ConfirmDialog
        open={deleteMessageDialog.open}
        onOpenChange={(open) => setDeleteMessageDialog({ open })}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete Message"
        variant="warning"
        onConfirm={confirmDeleteMessage}
      />

      {/* Clear Conversation Dialog */}
      <ConfirmDialog
        open={clearConversationDialog.open}
        onOpenChange={(open) => setClearConversationDialog({ open })}
        title="Clear Conversation"
        description="Are you sure you want to clear this entire conversation? This action cannot be undone."
        confirmText="Clear Conversation"
        variant="warning"
        onConfirm={confirmClearConversation}
      />

      {/* Delete All Messages Dialog */}
      <DoubleConfirmDialog
        open={deleteAllDialog}
        onOpenChange={setDeleteAllDialog}
        title="Delete ALL Messages"
        description="Are you sure you want to delete ALL chat messages? This action cannot be undone and will permanently remove all chat data from the system."
        secondDescription="This will permanently delete ALL chat messages and conversations. Are you absolutely sure?"
        confirmText="Delete All Messages"
        onConfirm={confirmDeleteAllMessages}
      />
    </div>
  )
}
