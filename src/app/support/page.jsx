"use client";

import { useState, useEffect, useCallback, useRef } from 'react'
 import { useToast } from '@/contexts/ToastContext'
 import { ConfirmDialog } from '@/components/ui/confirm-dialog'
 import { DoubleConfirmDialog } from '@/components/ui/double-confirm-dialog'
 import SelectiveDeleteDialog from '@/components/ui/selective-delete-dialog'
 import AdminLayout from '@/components/AdminLayout'

export default function SupportDashboard() {
  const [chats, setChats] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false })
  const [selectiveDeleteDialog, setSelectiveDeleteDialog] = useState({ open: false })
  const [clearDialog, setClearDialog] = useState({ open: false })
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [newReplies, setNewReplies] = useState(new Set())
  const [isOnline, setIsOnline] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [pollingPaused, setPollingPaused] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(15000)
  const [userPresence, setUserPresence] = useState(new Map())
  const [readStatus, setReadStatus] = useState(new Map())
  const [staffTyping, setStaffTyping] = useState(new Map())
  const [currentStaffId] = useState(`admin_${Date.now()}`)
  const { success, error } = useToast()
  const conversationEndRef = useRef(null)
  const pollingTimeoutRef = useRef(null)
  const lastActivityRef = useRef(new Date())

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted')
      })
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true)
    }
  }, [])

  const showNotification = useCallback((title, body) => {
    if (notificationsEnabled && 'Notification' in window) {
      try {
        new Notification(title, {
          body,
          icon: '/images/logo.png',
          badge: '/images/logo.png',
          tag: 'user-reply',
          requireInteraction: true
        })
      } catch (e) {
        console.warn('Failed to create notification', e)
      }
    }
  }, [notificationsEnabled])

  const playNotificationSound = () => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (e) {
        console.log('Audio notification not available')
      }
    }
  }

  const fetchChats = useCallback(async (showNotifications = false) => {
    try {
      const isDev = process.env.NODE_ENV === 'development'
      const enableApiLogs = process.env.NEXT_PUBLIC_ENABLE_API_LOGS === 'true'
      const showLogs = isDev && enableApiLogs
      if (showLogs) console.log('🔍 Fetching chats from /api/chat...')
      const response = await fetch('/api/chat')
      if (showLogs) console.log('📡 Response status:', response.status, response.statusText)
      if (response.ok) {
        const data = await response.json()
        if (data.chats && Array.isArray(data.chats)) {
          setChats(data.chats)
          setLastUpdateTime(new Date())
          setIsOnline(true)
        } else {
          setChats([])
        }
      } else {
        const errorText = await response.text()
        error('Error', `${response.status} ${response.statusText}`)
        setIsOnline(false)
      }
    } catch (err) {
      console.error('💥 Error fetching chats:', err)
      error('Error', 'Error loading chat messages')
      setIsOnline(false)
    }
  }, [error])

  const scheduleNextPoll = useCallback(() => {
    if (pollingPaused) return
    const timeSinceLastActivity = Date.now() - lastActivityRef.current.getTime()
    let interval = pollingInterval
    if (timeSinceLastActivity > 300000) {
      interval = Math.min(interval * 1.5, 120000)
      setPollingInterval(interval)
    } else if (timeSinceLastActivity > 60000) {
      interval = Math.min(interval * 1.2, 60000)
      setPollingInterval(interval)
    } else if (timeSinceLastActivity < 10000) {
      interval = Math.max(interval * 0.9, 10000)
      setPollingInterval(interval)
    }
    pollingTimeoutRef.current = setTimeout(() => {
      fetchChats(true)
      scheduleNextPoll()
    }, interval)
  }, [fetchChats, pollingInterval, pollingPaused])
  // Presence updater needs to be declared before effects that depend on it
  const updatePresence = useCallback(async (sessionIds) => {
    try {
      if (!sessionIds || sessionIds.length === 0) return
      const response = await fetch(`/api/chat/presence?sessionIds=${sessionIds.join(',')}`)
      if (response.ok) {
        const data = await response.json()
        const presenceMap = new Map()
        data.presence.forEach(p => {
          presenceMap.set(p.sessionId, p)
        })
        setUserPresence(presenceMap)
      }
    } catch (error) {
      console.error('Error fetching presence:', error)
    }
  }, [])

  useEffect(() => {
    fetchChats(false)
    scheduleNextPoll()
    if (chats.length > 0) {
      const sessionIds = chats.map(chat => chat.sessionId).filter(Boolean)
      updatePresence(sessionIds)
      const presenceInterval = setInterval(() => {
        updatePresence(sessionIds)
      }, 30000)
      return () => {
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current)
        }
        clearInterval(presenceInterval)
      }
    }
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current)
      }
    }
  }, [fetchChats, scheduleNextPoll, chats, updatePresence])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPollingPaused(true)
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current)
        }
      } else {
        setPollingPaused(false)
        setPollingInterval(30000)
        scheduleNextPoll()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [scheduleNextPoll])

  const markMessageAsRead = async (messageId) => {
    try {
      await fetch('/api/chat/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, action: 'mark_read', staffInfo: { staffId: currentStaffId, name: 'Support Agent' } })
      })
      setReadStatus(prev => new Map(prev).set(messageId, { isRead: true, readBy: currentStaffId, readAt: new Date() }))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const assignConversation = async (messageId) => {
    try {
      await fetch('/api/chat/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId, action: 'assign', staffInfo: { staffId: currentStaffId, name: 'Support Agent' } }) })
    } catch (error) {
      console.error('Error assigning conversation:', error)
    }
  }

  const updateMessageStatus = async (messageId, status) => {
    try {
      await fetch('/api/chat/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId, action: 'update_status', status }) })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleMessageSelect = (message) => {
    setSelectedMessage(message)
    setNewReplies(prev => {
      const updated = new Set(prev)
      updated.delete(message._id)
      return updated
    })
    markMessageAsRead(message._id)
    setTimeout(() => { conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 100)
  }

  useEffect(() => { if (selectedMessage && conversationEndRef.current) conversationEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [selectedMessage])

  const deleteMessage = async (messageId) => {
    const message = chats.find(chat => chat._id === messageId)
    if (message) {
      setSelectiveDeleteDialog({ open: true, messageId, userName: message.userInfo.name, userEmail: message.userInfo.email, type: 'message' })
    }
  }

  const handleSelectiveDelete = async (messageId, deleteType) => {
    try {
      const isResponse = selectiveDeleteDialog.type === 'response'
      const endpoint = isResponse ? `/api/chat/responses/${messageId}` : `/api/chat/${messageId}/delete`
      const response = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleteType, staffInfo: { id: 'admin', name: 'Support Admin' } }) })
      if (response.ok) {
        const result = await response.json()
        success('Success', result.message)
        if (!isResponse) setSelectedMessage(null)
        fetchChats()
      } else {
        const error = await response.json()
        throw new Error(error.error || `Failed to delete ${isResponse ? 'response' : 'message'}`)
      }
    } catch (err) {
      console.error('Error deleting:', err)
      error('Error', err instanceof Error ? err.message : 'Error deleting')
    }
  }

  const confirmDeleteMessage = async () => {
    const messageId = deleteDialog.messageId
    if (!messageId) return
    try {
      const response = await fetch(`/api/chat/${messageId}`, { method: 'DELETE' })
      if (response.ok) {
        success('Success', 'Message deleted permanently')
        setSelectedMessage(null)
        fetchChats()
      } else {
        throw new Error('Failed to delete message')
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      error('Error', 'Error deleting message')
    }
  }

  const clearConversation = async (sessionId) => setClearDialog({ open: true, sessionId })

  const deleteResponse = async (responseId, responseSender) => setSelectiveDeleteDialog({ open: true, messageId: responseId, userName: responseSender, userEmail: 'Response Message', type: 'response' })

  const handleResponseSelectiveDelete = async (responseId, deleteType) => {
    try {
      const response = await fetch(`/api/chat/responses/${responseId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleteType, staffInfo: { id: 'admin', name: 'Support Admin' } }) })
      if (response.ok) {
        const result = await response.json()
        success('Success', result.message)
        fetchChats()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete response')
      }
    } catch (err) {
      console.error('Error deleting response:', err)
      error('Error', err instanceof Error ? err.message : 'Error deleting response')
    }
  }

  const permanentDeleteResponse = async (responseId) => {
    try {
      const response = await fetch(`/api/chat/responses/${responseId}`, { method: 'POST' })
      if (response.ok) { success('Success', 'Response deleted permanently'); fetchChats() } else { throw new Error('Failed to delete response') }
    } catch (err) { console.error('Error deleting response:', err); error('Error', 'Error deleting response') }
  }

  const confirmClearConversation = async () => {
    const sessionId = clearDialog.sessionId
    if (!sessionId) return
    try {
      const response = await fetch(`/api/chat/conversation/${sessionId}`, { method: 'DELETE' })
      if (response.ok) { success('Success', 'Conversation cleared successfully'); setSelectedMessage(null); fetchChats() } else { throw new Error('Failed to clear conversation') }
    } catch (err) { console.error('Error clearing conversation:', err); error('Error', 'Error clearing conversation') }
  }

  const deleteAllMessages = async () => setBulkDeleteDialog(true)

  const confirmDeleteAllMessages = async () => {
    try {
      const response = await fetch('/api/chat/bulk-delete', { method: 'DELETE' })
      if (response.ok) { const result = await response.json(); success('Success', result.message || 'All messages deleted successfully'); setSelectedMessage(null); setChats([]); await fetchChats() } else { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to delete all messages') }
    } catch (err) { console.error('Error deleting all messages:', err); error('Error', 'Error deleting all messages') }
  }

  const submitResponse = async () => {
    if (!selectedMessage || !responseText.trim()) { error('Error', 'Please enter a response message'); return }
    const startTime = Date.now()
    setIsSubmittingResponse(true)
    try {
      const requestBody = { messageId: selectedMessage._id, response: responseText.trim(), supportAgent: 'Support Agent' }
      const response = await fetch('/api/chat/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
      if (response.ok) {
        const responseData = await response.json()
        const processingTime = Date.now() - startTime
        success('Success', `Response sent successfully (${processingTime}ms)`)
        setResponseText('')
        if (selectedMessage && responseData.response) {
          setChats(prev => prev.map(chat => chat._id === selectedMessage._id ? { ...chat, responses: [...(chat.responses || []), { message: responseData.response.message, timestamp: responseData.response.timestamp, supportAgent: responseData.response.supportAgent, isUserReply: false }], status: 'responded' } : chat))
          setSelectedMessage(prev => prev ? { ...prev, responses: [...(prev.responses || []), { message: responseData.response.message, timestamp: responseData.response.timestamp, supportAgent: responseData.response.supportAgent, isUserReply: false }], status: 'responded' } : prev)
        }
        setTimeout(() => { fetchChats(false) }, 2000)
      } else { const errorData = await response.text(); throw new Error(`Failed to send response: ${response.status} ${response.statusText}`) }
    } catch (err) { console.error('💥 Error sending response:', err); error('Error', `Error sending response: ${err instanceof Error ? err.message : 'Unknown error'}`) } finally { setIsSubmittingResponse(false) }
  }

  const filteredChats = chats.filter(chat => filter === 'all' ? true : chat.status === filter)
  const formatDate = (dateString) => { const date = new Date(dateString); return date.toLocaleDateString() + ' ' + date.toLocaleTimeString() }
  const getPriorityColor = (priority) => { switch (priority) { case 'urgent': return 'bg-red-100 text-red-800 border-red-200'; case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'; case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'; default: return 'bg-gray-100 text-gray-800 border-gray-200' } }
  const getStatusColor = (status) => { switch (status) { case 'new': return 'bg-green-100 text-green-800 border-green-200'; case 'reading': return 'bg-blue-100 text-blue-800 border-blue-200'; case 'responded': return 'bg-purple-100 text-purple-800 border-purple-200'; case 'user-replied': return 'bg-orange-100 text-orange-800 border-orange-200'; case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'; default: return 'bg-gray-100 text-gray-800 border-gray-200'; } }
  return (<>
    {/* Main UI block (kept from original file) */}
    <AdminLayout title="Support Dashboard" description="Manage customer support conversations">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gray-50/50">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
          {/* Live Status Indicator */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 text-sm">
            {/* Notification Toggle */}
            <button onClick={() => {
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    setNotificationsEnabled(permission === 'granted');
                });
            }
        }} className={`flex items-center justify-center space-x-2 px-3 py-1 rounded-lg border transition-colors ${notificationsEnabled
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6m2-3h6a2 2 0 012 2v8a2 2 0 01-2 2h-3"/>
                  </svg>
                  <span className="text-xs">
                    {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
                  </span>
                </button>
                
                {/* Polling Control */}
                <button onClick={() => {
            setPollingPaused(!pollingPaused);
            if (pollingPaused) {
                setPollingInterval(20000); // Reset to moderate polling when resuming
                scheduleNextPoll();
            }
            else if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        }} className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${pollingPaused
            ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
            : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'} border transition-colors`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {pollingPaused ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1"/>) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>)}
                  </svg>
                  <span className="text-xs">
                    {pollingPaused ? 'Paused' : `${Math.round(pollingInterval / 1000)}s`}
                  </span>
                </button>
                
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'Live' : 'Offline'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {lastUpdateTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex space-x-1 min-w-max">
                {['all', 'new', 'responded', 'user-replied', 'closed'].map((status) => {
            const count = status === 'all' ? chats.length : chats.filter(c => c.status === status).length;
            const newRepliesCount = status === 'all'
                ? newReplies.size
                : chats.filter(c => c.status === status && newReplies.has(c._id)).length;
            return (<button key={status} onClick={() => setFilter(status)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors relative flex-shrink-0 ${filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>
                      <span className="truncate">{status} ({count})</span>
                      {newRepliesCount > 0 && (<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center animate-pulse">
                          {newRepliesCount}
                        </span>)}
                    </button>);
        })}
                
                {/* Manual Refresh Button */}
                <button onClick={() => {
            fetchChats(true);
            setPollingInterval(10000); // Reset to moderate polling after manual refresh
            lastActivityRef.current = new Date();
        }} className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-300 transition-colors flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Management Toolbar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg border space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium text-gray-700">Chat Management</span>
                <span className="text-xs sm:text-sm text-gray-600">
                  Total: {chats.length} | New: {chats.filter(c => c.status === 'new').length}
                </span>
              </div>
              
              <div className="flex gap-2 justify-center sm:justify-end">
                <button onClick={() => fetchChats()} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                  Refresh
                </button>
                <button onClick={deleteAllMessages} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs sm:text-sm">
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
              
              {filteredChats.length === 0 ? (<div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <p>No conversations found</p>
                </div>) : (<div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredChats.map((chat) => (<div key={chat._id} onClick={() => handleMessageSelect(chat)} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 relative ${selectedMessage?._id === chat._id
                    ? 'bg-blue-100 border-blue-300 shadow-sm'
                    : newReplies.has(chat._id)
                        ? 'bg-green-50 hover:bg-green-100 border border-green-300 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'}`}>
                      {/* New Reply Indicator */}
                      {newReplies.has(chat._id) && (<div className="absolute top-2 right-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                            New Reply
                          </span>
                        </div>)}
                      
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative ${newReplies.has(chat._id) ? 'bg-green-100' : 'bg-blue-100'}`}>
                          <span className={`text-sm font-medium ${newReplies.has(chat._id) ? 'text-green-600' : 'text-blue-600'}`}>
                            {chat.userInfo.name.charAt(0).toUpperCase()}
                          </span>
                          {/* Online Status Indicator */}
                          {userPresence.get(chat.sessionId)?.userOnline && (<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 text-sm truncate">
                                {chat.userInfo.name}
                              </span>
                              {/* Read Status */}
                              {readStatus.get(chat._id)?.isRead && (<div className="flex items-center text-xs text-blue-500">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                  </svg>
                                  <span className="ml-1">Read</span>
                                </div>)}
                              {/* Typing Indicator */}
                              {userPresence.get(chat.sessionId)?.userActivity?.typing && (<div className="flex items-center text-xs text-green-500">
                                  <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                  </div>
                                  <span className="ml-1">typing...</span>
                                </div>)}
                            </div>
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
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2 break-words">
                        {chat.message}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 gap-2">
                        <span className="truncate min-w-0">{chat.userInfo.email}</span>
                        {chat.responses && chat.responses.length > 0 && (<span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full flex-shrink-0">
                            {chat.responses.length} reply{chat.responses.length !== 1 ? 's' : ''}
                          </span>)}
                      </div>
                    </div>))}
                </div>)}
            </div>

            {/* Chat Conversation View */}
            <div className="lg:col-span-2">
              {selectedMessage ? (<div className="flex flex-col h-[600px]">
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
                      {['reading', 'responded', 'closed'].map((status) => (<button key={status} onClick={() => updateMessageStatus(selectedMessage._id, status)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${selectedMessage.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                          Mark as {status}
                        </button>))}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {/* Initial User Message */}
                    <div className="flex justify-start group">
                      <div className="max-w-[85%] sm:max-w-[70%] relative">
                        <div className="bg-white rounded-lg p-3 shadow-sm border">
                          <p className="text-gray-800 break-words whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-1 break-words">
                          {selectedMessage.userInfo.name} • {formatDate(selectedMessage.timestamp)}
                        </div>
                        {/* Delete button for initial message */}
                        <button onClick={() => deleteMessage(selectedMessage._id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600" title="Delete message">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Support Responses and User Replies */}
                    {selectedMessage.responses && selectedMessage.responses.length > 0 && (selectedMessage.responses.map((response, index) => {
                const isRecent = new Date(response.timestamp) > new Date(Date.now() - 30000); // Last 30 seconds
                const responseId = response._id || `response-${index}`; // Get response ID
                return (<div key={index} className={`flex ${response.isUserReply ? 'justify-start' : 'justify-end'} group`}>
                            <div className="max-w-[85%] sm:max-w-[70%] relative">
                              <div className={`rounded-lg p-3 shadow-sm relative ${response.isUserReply
                        ? `bg-gray-100 text-gray-800 border-l-4 ${isRecent ? 'border-green-500 bg-green-50' : 'border-gray-300'}`
                        : 'bg-blue-600 text-white'}`}>
                                {response.isUserReply && isRecent && (<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>)}
                                <p className="break-words">{response.message}</p>
                              </div>
                              <div className={`text-xs mt-1 px-1 flex items-center flex-wrap ${response.isUserReply ? 'justify-start text-gray-600' : 'justify-end text-gray-500'}`}>
                                {response.isUserReply && (<div className="flex items-center space-x-1 mr-2">
                                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                      <span className="text-green-600 text-xs font-medium">
                                        {response.userInfo?.name?.charAt(0) || 'U'}
                                      </span>
                                    </div>
                                    {isRecent && <span className="text-green-600 font-medium text-xs">NEW</span>}
                                  </div>)}
                                <span className="break-all">
                                  {response.isUserReply
                        ? `${response.userInfo?.name || 'User'} • ${formatDate(response.timestamp)}`
                        : `${response.supportAgent} • ${formatDate(response.timestamp)}`}
                                </span>
                              </div>
                              
                              {/* Delete button for each response */}
                              <button onClick={() => deleteResponse(responseId, response.isUserReply ? (response.userInfo?.name || 'User') : response.supportAgent)} className={`absolute -top-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600 ${response.isUserReply ? '-right-2' : '-left-2'}`} title="Delete response">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            </div>
                          </div>);
            }))}
                    
                    {/* Scroll to bottom indicator */}
                    <div ref={conversationEndRef} className="h-1"></div>
                  </div>

                  {/* Response Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Type your response here..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={3} onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    submitResponse();
                }
            }}/>
                        <div className="text-xs text-gray-500 mt-1">
                          Press Ctrl+Enter to send quickly
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button onClick={submitResponse} disabled={isSubmittingResponse || !responseText.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                          {isSubmittingResponse ? (<>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>) : (<>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                              </svg>
                              Send
                            </>)}
                        </button>
                        <button onClick={() => setResponseText('')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
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
                        <button onClick={() => deleteMessage(selectedMessage._id)} className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-xs">
                          Delete Options
                        </button>
                        <button onClick={() => setDeleteDialog({ open: true, messageId: selectedMessage._id })} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs">
                          Permanent Delete
                        </button>
                        <button onClick={() => clearConversation(selectedMessage.sessionId)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs">
                          Clear Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>) : (<div className="h-[600px] flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a conversation from the left to view the chat history and respond</p>
                  </div>
                </div>)}
            </div>
          </div>
      </AdminLayout>

      {/* Delete Message Dialog */}
      <ConfirmDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })} title="Delete Message" description="Are you sure you want to delete this message? This action cannot be undone." confirmText="Delete Message" variant="danger" onConfirm={confirmDeleteMessage}/>

    {/* Selective Delete Dialog */}
    <SelectiveDeleteDialog open={selectiveDeleteDialog.open} onOpenChange={(open) => setSelectiveDeleteDialog({ open })} messageId={selectiveDeleteDialog.messageId || ''} userName={selectiveDeleteDialog.userName || ''} userEmail={selectiveDeleteDialog.userEmail || ''} onConfirm={handleSelectiveDelete}/>

    {/* Clear Conversation Dialog */}
    <ConfirmDialog open={clearDialog.open} onOpenChange={(open) => setClearDialog({ open })} title="Clear Conversation" description="Are you sure you want to clear this entire conversation? This action cannot be undone and will remove all messages in this conversation thread." confirmText="Clear Conversation" variant="warning" onConfirm={confirmClearConversation}/>

    {/* Bulk Delete Dialog */}
    <DoubleConfirmDialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog} title="Delete ALL Chat Messages" description="Are you sure you want to delete ALL chat messages? This action cannot be undone and will permanently remove all chat data from the system." secondaryDescription="This will permanently delete ALL chat messages and conversations. Are you absolutely sure?" confirmText="Continue" secondaryConfirmText="Yes, Delete Everything" onConfirm={confirmDeleteAllMessages}/>
  </>);
}
