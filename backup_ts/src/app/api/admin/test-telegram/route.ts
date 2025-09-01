import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { botToken, chatId } = await request.json()

    if (!botToken) {
      return NextResponse.json(
        { success: false, error: 'Bot token is required' },
        { status: 400 }
      )
    }

    // Test bot token by getting bot info
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const botInfo = await botInfoResponse.json()

    if (!botInfo.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid bot token' },
        { status: 400 }
      )
    }

    // If chat ID is provided, test sending a message
    if (chatId) {
      const testMessage = `🔧 *Admin Settings Test*\n\nTelegram connection is working correctly!\n\n• Bot: ${botInfo.result.first_name}\n• Username: @${botInfo.result.username}\n• Time: ${new Date().toLocaleString()}`

      const sendResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: 'Markdown',
        }),
      })

      const sendResult = await sendResponse.json()

      if (!sendResult.ok) {
        return NextResponse.json(
          { success: false, error: `Failed to send test message: ${sendResult.description}` },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Test message sent successfully to chat ${chatId}`,
        botInfo: {
          name: botInfo.result.first_name,
          username: botInfo.result.username
        }
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'Bot token is valid',
        botInfo: {
          name: botInfo.result.first_name,
          username: botInfo.result.username
        }
      })
    }
  } catch (error) {
    console.error('Error testing Telegram connection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to test Telegram connection' },
      { status: 500 }
    )
  }
}
