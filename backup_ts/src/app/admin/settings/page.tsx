'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import AdminLayout from '@/components/AdminLayout'

interface Settings {
  telegramBotToken: string
  telegramSupportChatId: string
  mongodbUri: string
  baseUrl: string
  supportPassword: string
}

export default function AdminSettings() {
  const { success, error: showError, warning, info } = useToast()
  const [settings, setSettings] = useState<Settings>({
    telegramBotToken: '',
    telegramSupportChatId: '',
    mongodbUri: '',
    baseUrl: '',
    supportPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testingTelegram, setTestingTelegram] = useState(false)
  const [testingDatabase, setTestingDatabase] = useState(false)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      showError('Loading Failed', 'Failed to load settings from server')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      })

      if (response.ok) {
        success('Settings Saved', 'Configuration updated successfully! Restart the application to apply changes.')
      } else {
        const error = await response.json()
        showError('Save Failed', error.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showError('Save Failed', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const testTelegramConnection = async () => {
    if (!settings.telegramBotToken) {
      showError('Missing Token', 'Please enter Telegram Bot Token first')
      return
    }

    setTestingTelegram(true)
    info('Testing Connection', 'Testing Telegram connection...')

    try {
      const response = await fetch('/api/admin/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          botToken: settings.telegramBotToken,
          chatId: settings.telegramSupportChatId 
        }),
      })

      const result = await response.json()
      if (result.success) {
        success('Connection Successful', 'Telegram bot is working correctly!')
      } else {
        showError('Connection Failed', result.error || 'Telegram connection failed')
      }
    } catch (error) {
      showError('Test Failed', 'Failed to test Telegram connection')
    } finally {
      setTestingTelegram(false)
    }
  }

  const testDatabaseConnection = async () => {
    if (!settings.mongodbUri) {
      showError('Missing URI', 'Please enter MongoDB URI first')
      return
    }

    setTestingDatabase(true)
    info('Testing Connection', 'Testing database connection...')

    try {
      const response = await fetch('/api/admin/test-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mongodbUri: settings.mongodbUri }),
      })

      const result = await response.json()
      if (result.success) {
        success('Connection Successful', 'Database connection test successful!')
      } else {
        showError('Connection Failed', result.error || 'Database connection failed')
      }
    } catch (error) {
      showError('Test Failed', 'Failed to test database connection')
    } finally {
      setTestingDatabase(false)
    }
  }

  return (
    <AdminLayout title="Admin Settings" description="Configure application environment variables">
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={saveSettings} className="space-y-8 p-6">
          {/* Telegram Configuration */}
          <div className="bg-gray-50/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Telegram Configuration</h3>
                <p className="text-sm text-gray-600">Configure Telegram bot for support notifications</p>
              </div>
                <button
                  type="button"
                  onClick={testTelegramConnection}
                  disabled={testingTelegram}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {testingTelegram && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {testingTelegram ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram Bot Token
                  </label>
                  <input
                    type="text"
                    value={settings.telegramBotToken}
                    onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="7367138384:AAFaZWsTFEXLQeSnQn8wnKlfLMDHvahdRok"
                  />
                  <p className="text-xs text-gray-500 mt-1">Get this from @BotFather on Telegram</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Chat ID
                  </label>
                  <input
                    type="text"
                    value={settings.telegramSupportChatId}
                    onChange={(e) => setSettings({ ...settings, telegramSupportChatId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2043046462"
                  />
                  <p className="text-xs text-gray-500 mt-1">Chat ID where notifications will be sent</p>
                </div>
              </div>
            </div>

            {/* Database Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Database Configuration</h3>
                  <p className="text-sm text-gray-600">Configure MongoDB connection</p>
                </div>
                <button
                  type="button"
                  onClick={testDatabaseConnection}
                  disabled={testingDatabase}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {testingDatabase && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {testingDatabase ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MongoDB URI
                </label>
                <input
                  type="text"
                  value={settings.mongodbUri}
                  onChange={(e) => setSettings({ ...settings, mongodbUri: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="mongodb://localhost:27017/grant-support"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Local: mongodb://localhost:27017/grant-support<br/>
                  Atlas: mongodb+srv://username:password@cluster.mongodb.net/grant-support
                </p>
              </div>
            </div>

            {/* Application Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Application Configuration</h3>
                <p className="text-sm text-gray-600">Configure application settings</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={settings.baseUrl}
                    onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="http://localhost:3000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your application&apos;s URL (used in Telegram notifications)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Dashboard Password
                  </label>
                  <input
                    type="text"
                    value={settings.supportPassword}
                    onChange={(e) => setSettings({ ...settings, supportPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="support123"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password for accessing support dashboard</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
    </AdminLayout>
  )
}
