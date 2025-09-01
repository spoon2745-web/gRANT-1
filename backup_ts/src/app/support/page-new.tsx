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
  const { showToast } = useToast()

  // Dialog states
  const [deleteMessageDialog, setDeleteMessageDialog] = useState<{ open: boolean; messageId?: string }>({ open: false })
  const [clearConversationDialog, setClearConversationDialog] = useState<{ open: boolean; sessionId?: string }>({ open: false })
  const [deleteAllDialog, setDeleteAllDialog] = useState(false)

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch('/api/chat')
      if (response.ok) {
        const data = await response.json()
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
      showToast('Error loading chat messages', 'error')
    }
  }, [showToast])

  useEffect(() => {
    fetchChats()
    const interval = setInterval(fetchChats, 30000) // Refresh every 30 seconds
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
        showToast('Message deleted successfully', 'success')
        setSelectedMessage(null)
        fetchChats()
      } else {
        throw new Error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      showToast('Error deleting message', 'error')
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
        showToast('Conversation cleared successfully', 'success')
        setSelectedMessage(null)
        fetchChats()
      } else {
        throw new Error('Failed to clear conversation')
      }
    } catch (error) {
      console.error('Error clearing conversation:', error)
      showToast('Error clearing conversation', 'error')
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
        showToast('All messages deleted successfully', 'success')
        setSelectedMessage(null)
        setChats([])
      } else {
        throw new Error('Failed to delete all messages')
      }
    } catch (error) {
      console.error('Error deleting all messages:', error)
      showToast('Error deleting all messages', 'error')
    } finally {
      setDeleteAllDialog(false)
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Dashboard</h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6">
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
                {status}
              </button>
            ))}
          </div>

          {/* Management Toolbar */}
          <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-medium text-gray-700">Chat Management</h3>
              {selectedMessage && (
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMessage(selectedMessage._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Message
                  </button>
                  <button
                    onClick={() => clearConversation(selectedMessage.sessionId)}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2H10.828a2 2 0 00-1.414.586L3 12z" />
                    </svg>
                    Clear Conversation
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={deleteAllMessages}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Delete All Messages
              </button>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="space-y-4">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No chat messages found for the selected filter.
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedMessage(chat)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMessage?._id === chat._id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{chat.userInfo.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(chat.priority)}`}>
                        {chat.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(chat.status)}`}>
                        {chat.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(chat.timestamp)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {chat.userInfo.email}
                  </div>
                  
                  <div className="text-gray-700 line-clamp-2">
                    {chat.message}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Session: {chat.sessionId.slice(-8)}
                    {chat.responses && chat.responses.length > 0 && (
                      <span className="ml-2">• {chat.responses.length} response(s)</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected Message Details */}
          {selectedMessage && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-4">Message Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span> {selectedMessage.userInfo.name}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span> {selectedMessage.userInfo.email}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Priority:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Session:</span> {selectedMessage.sessionId}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Timestamp:</span> {formatDate(selectedMessage.timestamp)}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="font-medium text-gray-700">Message:</span>
                <div className="mt-1 p-3 bg-white rounded border text-gray-700">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.responses && selectedMessage.responses.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Responses:</span>
                  <div className="mt-2 space-y-2">
                    {selectedMessage.responses.map((response, index) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <div className="text-sm text-gray-600 mb-1">
                          {response.supportAgent} • {formatDate(response.timestamp)}
                        </div>
                        <div className="text-gray-700">{response.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
