'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  checkAuth: () => boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

interface AdminAuthProviderProps {
  children: ReactNode
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = (): boolean => {
    const authData = localStorage.getItem('adminAuth')
    if (!authData) {
      setIsAuthenticated(false)
      return false
    }

    try {
      const { timestamp, authenticated } = JSON.parse(authData)
      const now = Date.now()
      const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours

      // Check if session is still valid
      if (authenticated && (now - timestamp) < sessionDuration) {
        setIsAuthenticated(true)
        return true
      } else {
        // Session expired
        localStorage.removeItem('adminAuth')
        setIsAuthenticated(false)
        return false
      }
    } catch (error) {
      localStorage.removeItem('adminAuth')
      setIsAuthenticated(false)
      return false
    }
  }

  const login = (password: string): boolean => {
    // Multiple valid passwords for different admin levels
    const validPasswords = [
      'grant2024',      // Main admin password
      'support123',     // Support password
      'admin123'        // Alternative admin password
    ]

    if (validPasswords.includes(password.trim())) {
      const authData = {
        authenticated: true,
        timestamp: Date.now()
      }
      localStorage.setItem('adminAuth', JSON.stringify(authData))
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminSettingsAuth') // Clear old auth
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
