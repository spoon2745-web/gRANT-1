# Support Chat System

This project includes a comprehensive support chat system with the following features:

## Features

### 🎯 **Floating Chat Widget**
- Appears on all pages as a floating button in the bottom-right corner
- Animated notification badge to attract attention
- Clean, modern chat interface
- User information collection before chat starts
- Real-time message display with timestamps

### 📱 **Telegram Notifications**
- Automatic notifications sent to support team via Telegram
- Includes user information and message content
- Formatted messages for easy reading
- Instant alerts when new messages arrive

### 👩‍💼 **Support Dashboard**
- Dedicated admin interface at `/support`
- Login authentication for support staff
- View all chat messages in chronological order
- Respond to user messages
- Track response status
- Clean, professional interface

## Setup Instructions

### 1. Telegram Bot Setup

1. **Create a Telegram Bot:**
   - Message @BotFather on Telegram
   - Use `/newbot` command
   - Follow instructions to create your bot
   - Save the bot token

2. **Create Support Group:**
   - Create a new Telegram group for your support team
   - Add your bot to the group
   - Make the bot an admin (optional but recommended)

3. **Get Chat ID:**
   - Add your bot to the group
   - Send a message to the group
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your group's chat ID in the response

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_SUPPORT_CHAT_ID=your_chat_id_here
```

### 3. Support Dashboard Access

- **URL:** `/support`
- **Username:** `support`
- **Password:** `grant2024`

## How It Works

### 1. User Flow
1. User clicks the floating chat button
2. Enters name and email
3. Types their support question
4. Message is stored and Telegram notification sent
5. User receives confirmation that support will respond

### 2. Support Team Flow
1. Receives Telegram notification with user details and message
2. Logs into support dashboard at `/support`
3. Views message list and selects user to respond to
4. Types response in the dashboard
5. Response is recorded (in production, would be sent to user)

### 3. Telegram Notification Format
```
🆘 New Support Chat Message

👤 User: John Doe
📧 Email: john@example.com
🕐 Time: 12/25/2024, 3:45:30 PM

💬 Message:
I need help with my grant application...

---
Reply via the support dashboard to respond to this user.
```

## Components Overview

### `FloatingChat.tsx`
- Main chat widget component
- Handles user interaction and message sending
- Responsive design with mobile support
- State management for chat flow

### `SupportDashboard.tsx`
- Admin interface for support staff
- Message viewing and response functionality
- Authentication and session management
- Professional dashboard layout

### `/api/chat/route.ts`
- Backend API for message handling
- Telegram integration
- Message storage (currently in-memory)
- Error handling and logging

## Customization

### Styling
- Uses Tailwind CSS for consistent styling
- Gradient themes matching your brand colors
- Responsive design for all screen sizes
- Smooth animations and transitions

### Branding
- Easy to customize colors and messaging
- Professional appearance matching your site design
- Consistent with your existing UI components

### Functionality
- Can be extended with real-time chat via WebSocket
- Database integration for persistent storage
- Email notifications in addition to Telegram
- File upload support for chat messages

## Production Considerations

### Security
- Implement proper authentication for support dashboard
- Use secure session management
- Rate limiting for chat API
- Input validation and sanitization

### Scalability
- Replace in-memory storage with database (PostgreSQL, MongoDB)
- Add Redis for real-time features
- Implement WebSocket for live chat
- Add load balancing for high traffic

### Monitoring
- Add logging for all chat interactions
- Monitor Telegram API usage
- Track response times and user satisfaction
- Analytics for support team performance

## Future Enhancements

- **Real-time Chat:** WebSocket integration for instant messaging
- **File Uploads:** Allow users to attach documents or images
- **Chat History:** Persistent conversation threads
- **Multiple Support Agents:** Round-robin assignment
- **Canned Responses:** Quick replies for common questions
- **Chat Analytics:** Response times, user satisfaction
- **Mobile App:** Native mobile support
- **Integration:** CRM and helpdesk system integration
