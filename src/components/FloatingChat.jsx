 'use client'

 import { useState, useRef, useEffect, useCallback } from 'react'
 import { useToast } from '@/contexts/ToastContext'
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog"
 import { Button } from "@/components/ui/button"
 import { ConfirmDialog } from "@/components/ui/confirm-dialog"

 export default function FloatingChat() {
   const [isOpen, setIsOpen] = useState(false)
   const [messages, setMessages] = useState([])
   const [newMessage, setNewMessage] = useState('')
   const [isTyping, setIsTyping] = useState(false)
   const [userInfo, setUserInfo] = useState({ name: '', email: '' })
   const [hasUserInfo, setHasUserInfo] = useState(false)
   const [sessionId, setSessionId] = useState('')
   const [lastCheckedForResponses, setLastCheckedForResponses] = useState(null)
   const [hasNewMessages, setHasNewMessages] = useState(false)
   const [notificationPermission, setNotificationPermission] = useState('default')
   const [isFirstUserMessage, setIsFirstUserMessage] = useState(true)
   const [showClearDialog, setShowClearDialog] = useState(false)
   const [deleteMessageDialog, setDeleteMessageDialog] = useState({ open: false })
   const [clearMessagesDialog, setClearMessagesDialog] = useState(false)
   const messagesEndRef = useRef(null)
   const _toast = useToast()
   const { success, error: showError, info } = _toast

   async function requestNotificationPermission() {
     if (typeof window === 'undefined') return 'denied'
     if ('Notification' in window && Notification.permission === 'default') {
       const permission = await Notification.requestPermission()
       setNotificationPermission(permission)
       if (permission === 'granted') {
         showNotification('Impact Grant Solutions Chat', 'Notifications enabled! We\'ll notify you when our support team responds.')
         info('Browser Notifications Enabled', 'You\'ll receive notifications when our support team responds!')
       } else if (permission === 'denied') {
         info('Browser Notifications Disabled', 'You can enable notifications in your browser settings anytime.')
       }
    
      return permission
    }

    return Notification.permission
  }
    // Check for new responses from support staff with conservative polling
    useEffect(() => {
        if (!hasUserInfo || !sessionId)
            return;
        let isPolling = false; // Prevent overlapping requests
        let timeoutId;
        const checkForResponses = async () => {
            if (isPolling)
                return; // Skip if already polling
            isPolling = true;
            try {
                const checkTime = new Date();
                let url = `/api/chat/user-responses?sessionId=${sessionId}`;
                if (lastCheckedForResponses) {
                    url += `&lastChecked=${lastCheckedForResponses.toISOString()}`;
                }
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.newResponses && data.newResponses.length > 0) {
                        // Add new support responses to messages
                        const supportMessages = data.newResponses.map((resp) => ({
                            id: resp._id,
                            content: resp.response,
                            isUser: false,
                            timestamp: new Date(resp.timestamp)
                        }));
                        setMessages(prev => {
                            // Check if we already have these messages to avoid duplicates
                            const existingIds = prev.map(m => m.id);
                            const newMessages = supportMessages.filter(msg => !existingIds.includes(msg.id));
                            return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
                        });
                        // Show notification if chat is closed
                        if (!isOpen && supportMessages.length > 0) {
                            setHasNewMessages(true);
                            // Show browser notification
                            const firstMessage = supportMessages[0];
                            // Inline notification creation to avoid cross-binding init order issues
                            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                                try {
                                    const notification = new Notification('💬 New Support Response', {
                                        body: firstMessage.content.substring(0, 100) + (firstMessage.content.length > 100 ? '...' : ''),
                                        icon: '/favicon.ico',
                                        badge: '/favicon.ico',
                                        tag: 'support-response',
                                        requireInteraction: true,
                                        silent: false
                                    });
                                    setTimeout(() => {
                                        try { notification.close(); } catch (e) { }
                                    }, 10000);
                                    notification.onclick = () => {
                                        try { window.focus(); setIsOpen(true); setHasNewMessages(false); notification.close(); } catch (e) { }
                                    };
                                } catch (e) {
                                    console.error('Failed to show browser notification', e);
                                }
                            }
                            // Also show site toast notification
                            info('New Support Response', `💬 ${firstMessage.content.substring(0, 60)}${firstMessage.content.length > 60 ? '...' : ''}`);
                            console.log('New support response received!');
                        }
                    }
                }
                setLastCheckedForResponses(checkTime);
            }
            catch (error) {
                console.error('Error checking for responses:', error);
            }
            finally {
                isPolling = false;
            }
        };
        // Much more conservative polling intervals to prevent server overload
        const getPollingInterval = () => {
            if (isOpen) {
                return 8000; // 8 seconds when chat is open - reduced from 1.5s
            }
            else if (hasNewMessages) {
                return 15000; // 15 seconds when there are unread messages - reduced from 3s
            }
            else {
                return 30000; // 30 seconds for background polling - increased from 8s
            }
        };
        const scheduleNextCheck = () => {
            timeoutId = setTimeout(() => {
                checkForResponses().then(() => {
                    scheduleNextCheck(); // Schedule next check after current one completes
                });
            }, getPollingInterval());
        };
        // Start with immediate check, then schedule regular checks
        checkForResponses().then(() => {
            scheduleNextCheck();
        });
        return () => {
            clearTimeout(timeoutId);
        };
    }, [hasUserInfo, sessionId, isOpen, hasNewMessages, lastCheckedForResponses, info]);
    // create a stable ref for sendPresenceUpdate so callbacks can use it without being in deps
    const sendPresenceUpdateRef = useRef(null)
    // populate ref when sessionId changes (sendPresenceUpdate closure depends on sessionId)
    useEffect(() => {
      sendPresenceUpdateRef.current = async (action) => {
        if (!sessionId) return
        try {
          await fetch('/api/chat/presence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, isOnline: action !== 'offline', action }) })
        } catch (err) { console.error('Error updating presence:', err) }
      }
    }, [sessionId])
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSubmitUserInfo = (e) => {
        e.preventDefault();
        if (userInfo.name && userInfo.email) {
            setHasUserInfo(true);
            // Save user info and status to localStorage
            localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));
            localStorage.setItem('chatHasUserInfo', 'true');
            // Request notification permission
            requestNotificationPermission();
            // Show success toast
            success('Profile Setup Complete', `Welcome ${userInfo.name}! Your chat session is now active.`);
      // Send personalized welcome message — replace the generic initial welcome
      const welcomeMessage = {
        id: Date.now().toString(),
        content: `Welcome back ${userInfo.name}! We're here to help you with your grant application. What specific questions do you have?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => {
        // If the only existing message is the generic opener, replace it
        if (prev.length === 1 && prev[0] && !prev[0].isUser && typeof prev[0].content === 'string' && prev[0].content.includes('Hi! How can we help you')) {
          return [welcomeMessage];
        }
        // Avoid adding duplicate personalized welcome
        if (prev.some(m => m.content === welcomeMessage.content)) return prev;
        return [...prev, welcomeMessage];
      });
        }
        else {
            showError('Incomplete Information', 'Please provide both your name and email address.');
        }
    };
    const typingTimeoutRef = useRef(null);
    // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      if (sendPresenceUpdateRef.current) sendPresenceUpdateRef.current('typing')
    }
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (sendPresenceUpdateRef.current) sendPresenceUpdateRef.current('stop_typing')
    }, 2000);
  }, [isTyping]);
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
        if (e.target.value.trim()) {
            handleTyping();
        }
    };
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim())
            return;
        const userMessage = {
            id: Date.now().toString(),
            content: newMessage,
            isUser: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsTyping(true);
        // Send to backend API with Telegram notification
        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: newMessage,
                    userInfo: userInfo,
                    timestamp: new Date().toISOString(),
                    sessionId: sessionId
                }),
            });
            success('Message Sent', 'Your message has been sent to our support team!');
        }
        catch (error) {
            console.error('Failed to send message:', error);
            showError('Message Failed', 'Failed to send your message. Please try again.');
        }
        // Only send automatic response for the first user message in a session
        if (isFirstUserMessage) {
            // Simulate support response (in real app, this would come from support staff)
            setTimeout(() => {
                setIsTyping(false);
                const supportMessage = {
                    id: (Date.now() + 1).toString(),
                    content: "Thank you for your message! A support team member will respond shortly. In the meantime, you can check our FAQ section for common questions.",
                    isUser: false,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, supportMessage]);
            }, 2000);
            // Mark that we've now sent the first user message
            setIsFirstUserMessage(false);
        }
        else {
            // For subsequent messages, just stop the typing indicator
            setTimeout(() => {
                setIsTyping(false);
            }, 1000);
        }
    };
    const clearChatSession = () => {
        setShowClearDialog(true);
    };
    const confirmClearChat = () => {
        // Clear localStorage
        localStorage.removeItem('chatUserInfo');
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('chatSessionId');
        localStorage.removeItem('chatHasUserInfo');
        // Reset state
        setUserInfo({ name: '', email: '' });
        setHasUserInfo(false);
        setIsFirstUserMessage(true);
        setMessages([{
                id: '1',
                content: "Hi! How can we help you with your grant application today?",
                isUser: false,
                timestamp: new Date()
            }]);
        // Generate new session ID
        const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        setSessionId(newSessionId);
        localStorage.setItem('chatSessionId', newSessionId);
        // Close dialog and show confirmation toast
        setShowClearDialog(false);
        success('Chat Reset', 'Your chat session has been reset. You can start a new conversation anytime!');
    };
    const deleteMessage = (messageId) => {
        setDeleteMessageDialog({ open: true, messageId });
    };
    const confirmDeleteMessage = () => {
        const messageId = deleteMessageDialog.messageId;
        if (!messageId)
            return;
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        info('Message Deleted', 'The message has been removed from your chat.');
    };
    const clearAllMessages = () => {
        if (messages.length <= 1) {
            info('No Messages', 'There are no messages to clear.');
            return;
        }
        setClearMessagesDialog(true);
    };
    const confirmClearAllMessages = () => {
        // Keep only the welcome message
        const welcomeMessage = {
            id: Date.now().toString(),
            content: "Hi! How can we help you with your grant application today?",
            isUser: false,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
        success('Messages Cleared', 'All messages have been cleared from your chat.');
    };
    // Request permission and showNotification are declared earlier
    return (<>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={async () => {
            const wasOpen = isOpen;
            setIsOpen(!isOpen);
            if (!isOpen) {
                setHasNewMessages(false); // Clear new message indicator when opening
                // Force immediate check for new responses when opening chat
                if (hasUserInfo && sessionId) {
                    try {
                        const checkTime = new Date();
                        let url = `/api/chat/user-responses?sessionId=${sessionId}`;
                        if (lastCheckedForResponses) {
                            url += `&lastChecked=${lastCheckedForResponses.toISOString()}`;
                        }
                        const response = await fetch(url);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.newResponses && data.newResponses.length > 0) {
                                const supportMessages = data.newResponses.map((resp) => ({
                                    id: resp._id,
                                    content: resp.response,
                                    isUser: false,
                                    timestamp: new Date(resp.timestamp)
                                }));
                                setMessages(prev => {
                                    const existingIds = prev.map(m => m.id);
                                    const newMessages = supportMessages.filter(msg => !existingIds.includes(msg.id));
                                    return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
                                });
                            }
                            setLastCheckedForResponses(checkTime);
                        }
                    }
                    catch (error) {
                        console.error('Error checking for responses on chat open:', error);
                    }
                }
                if (!wasOpen) {
                    info('Chat Opened', 'Welcome! How can we help you today?');
                }
            }
            else {
                info('Chat Minimized', 'Click the chat button anytime to continue the conversation');
            }
        }} className="group relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
          {/* Notification Badge */}
          {hasNewMessages && !isOpen && (<div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              !
            </div>)}
          
          {/* Icon */}
          {isOpen ? (<svg className="w-8 h-8 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>) : (<svg className="w-8 h-8 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>)}
          
          {/* Floating Animation Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
        </button>

        {/* Tooltip */}
        {!isOpen && (<div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {hasNewMessages ? 'New message from support!' : 'Need help? Chat with support'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>)}
      </div>

      {/* Chat Window */}
      {isOpen && (<div className="fixed bottom-24 right-2 left-2 sm:left-auto sm:right-6 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Impact Grant Solutions Support</h3>
                <p className="text-sm opacity-90">We&apos;re here to help!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearAllMessages} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors" title="Clear all messages">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <button onClick={clearChatSession} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors" title="Reset session (clear everything)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors" title="Close chat">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
                {isTyping && (<div className="flex items-center space-x-1 text-blue-600">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span>You are typing...</span>
                  </div>)}
              </div>
              <div className="text-gray-500">
                {messages.length > 0 && `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>

          {/* User Info Form */}
          {!hasUserInfo ? (<div className="flex-1 p-6 flex items-center justify-center">
              <form onSubmit={handleSubmitUserInfo} className="w-full space-y-4">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Support</h4>
                  <p className="text-gray-600 text-sm">Please tell us a bit about yourself so we can help you better.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" value={userInfo.name} onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" required/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={userInfo.email} onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com" required/>
                </div>
                
                <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                  Start Chat
                </button>
              </form>
            </div>) : (<>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (<div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-3 rounded-2xl ${message.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.isUser && message.id !== '1' && (<button onClick={() => deleteMessage(message.id)} className="w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors text-gray-400 hover:text-red-600 mt-1" title="Delete this message">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>)}
                    </div>
                  </div>))}
                
                {/* Typing Indicator */}
                {isTyping && (<div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>)}
                <div ref={messagesEndRef}/>
              </div>

              {/* Chat Management Actions */}
              {messages.length > 1 && (<div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <div className="flex gap-2 justify-center">
                    <button onClick={clearAllMessages} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Clear Messages
                    </button>
                    <button onClick={clearChatSession} className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      Reset Session
                    </button>
                  </div>
                </div>)}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input type="text" value={newMessage} onChange={handleMessageChange} placeholder="Type your message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </form>
              </div>
            </>)}
        </div>)}

      {/* Clear Chat Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              Clear All Chat Messages
            </DialogTitle>
            <DialogDescription className="py-2">
              Are you sure you want to clear all chat messages? This cannot be undone and will permanently remove all conversation history from your session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmClearChat} className="bg-red-600 hover:bg-red-700 text-white">
              Clear All Messages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Message Dialog */}
      <ConfirmDialog open={deleteMessageDialog.open} onOpenChange={(open) => setDeleteMessageDialog({ open })} title="Delete Message" description="Are you sure you want to delete this message? This action cannot be undone." confirmText="Delete Message" variant="warning" onConfirm={confirmDeleteMessage}/>

      {/* Clear All Messages Dialog */}
      <ConfirmDialog open={clearMessagesDialog} onOpenChange={setClearMessagesDialog} title="Clear All Messages" description="Are you sure you want to clear all messages? This will keep your session but remove all conversation history." confirmText="Clear Messages" variant="warning" onConfirm={confirmClearAllMessages}/>
    </>);
}
