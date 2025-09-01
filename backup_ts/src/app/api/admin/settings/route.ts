import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to the .env file
const envPath = path.join(process.cwd(), '.env')

export async function GET() {
  try {
    // Read current .env file
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }

    // Parse environment variables
    const settings = {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramSupportChatId: process.env.TELEGRAM_SUPPORT_CHAT_ID || '',
      mongodbUri: process.env.MONGODB_URI || '',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
      supportPassword: process.env.NEXT_PUBLIC_SUPPORT_PASSWORD || ''
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Error loading settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { settings } = await request.json()

    // Validate required fields
    if (!settings.telegramBotToken || !settings.mongodbUri) {
      return NextResponse.json(
        { success: false, error: 'Telegram Bot Token and MongoDB URI are required' },
        { status: 400 }
      )
    }

    // Create new .env content
    const envContent = `TELEGRAM_BOT_TOKEN=${settings.telegramBotToken}
TELEGRAM_SUPPORT_CHAT_ID=${settings.telegramSupportChatId}

# MongoDB Configuration
MONGODB_URI=${settings.mongodbUri}

# Application URL
NEXT_PUBLIC_BASE_URL=${settings.baseUrl}

# Support Dashboard
NEXT_PUBLIC_SUPPORT_PASSWORD=${settings.supportPassword}
`

    // Write to .env file
    fs.writeFileSync(envPath, envContent, 'utf8')

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully. Please restart the application to apply changes.' 
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
