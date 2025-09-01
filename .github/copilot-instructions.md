<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Grant Application Website Instructions

This is a Next.js application featuring comprehensive grant application management with an integrated support chat system.

## Technology Stack & Architecture
- **Next.js 15** with App Router for server-side rendering and API routes
- **TypeScript** for type safety across components and APIs
- **Tailwind CSS** for utility-first styling with responsive design
- **MongoDB** with Mongoose for data persistence (chat messages, user sessions)
- **Radix UI** components for accessible dialog/modal interfaces
- **Telegram Bot API** integration for support team notifications

## Key Features & Components

### Support Chat System (`/src/components/FloatingChat.tsx`)
- **Floating widget**: Persistent chat button with notification badges
- **User session management**: LocalStorage-based state persistence across browser sessions
- **Real-time features**: Polling for new support responses every 10 seconds
- **MongoDB integration**: Messages stored with session tracking and priority levels
- **Telegram notifications**: Automatic alerts to support team via webhook

### Database Schema (`/src/models/Chat.ts`)
```typescript
// Core entities with Mongoose schemas
ChatMessage: { message, userInfo, sessionId, status, priority, responses[] }
ChatResponse: { messageId, response, staffInfo, timestamp, deliveryStatus }
UserSession: { sessionId, userInfo, messageCount, lastActivity }
```

### API Architecture (`/src/app/api/chat/`)
- **RESTful endpoints**: Full CRUD operations for chat management
- **Session-based threading**: Messages grouped by auto-generated sessionId
- **Bulk operations**: `/bulk-delete` route for administrative cleanup
- **Response tracking**: Separate endpoints for user vs support responses
- **Connection management**: Robust MongoDB connection handling with retry logic

## Critical Patterns & Conventions

### Database Connection Pattern
```typescript
// Always ensure connection state before operations
await connectToDatabase()
if (mongoose.connection.readyState !== 1) {
  await new Promise((resolve) => {
    mongoose.connection.once('connected', resolve)
  })
}
```

### Session Management
- **Session IDs**: Generated as `session_${timestamp}_${randomString}`
- **LocalStorage keys**: `chatUserInfo`, `chatMessages`, `chatSessionId`, `chatHasUserInfo`
- **State persistence**: User information and message history survive browser reloads

### Component Communication
- **Toast system**: Context-based notifications via `ToastContext`
- **Dialog confirmations**: Radix UI dialogs replace browser `confirm()` calls
- **API responses**: Consistent `{ success: boolean, error?: string }` format

## Development Workflows

### Start Development Server
```bash
npm run dev  # Available as VS Code task: "dev"
```

### Chat System Testing
1. Open floating chat widget
2. Complete user info form (name + email)
3. Send test message → triggers Telegram notification
4. Check `/support` dashboard for admin view
5. Use bulk delete APIs for cleanup

### Database Operations
- **MongoDB URI**: Required in `.env.local`
- **Telegram config**: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_SUPPORT_CHAT_ID`
- **Connection pooling**: Configured with 10 max connections, 5s timeout

## Support Dashboard (`/src/app/support/`)
- **Authentication**: Basic credentials (`support`/`grant2024`)
- **Message management**: View, respond, and delete chat messages
- **Session tracking**: Group conversations by sessionId
- **Bulk operations**: Clear all messages with confirmation dialogs

## UI/UX Patterns
- **Responsive design**: Mobile-first with Tailwind breakpoints
- **Loading states**: Typing indicators, connection status display
- **Error handling**: Toast notifications for user feedback
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## Telegram Integration
- **Webhook notifications**: Auto-sent for new chat messages only
- **Message formatting**: Includes user details, priority, session links
- **Error resilience**: Graceful fallback if Telegram API unavailable

## Future Enhancement Areas
- **Real-time updates**: WebSocket implementation for instant messaging
- **File uploads**: Attachment support in chat interface
- **Analytics**: Response time tracking, user satisfaction metrics
- **Scaling**: Redis for session management, load balancing for high traffic
