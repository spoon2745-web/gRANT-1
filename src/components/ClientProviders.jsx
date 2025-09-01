'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ToastProvider } from '@/contexts/ToastContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'

// Dynamically load heavy/client UI pieces to avoid circular initialization
// and top-level side-effects during module evaluation.
const Header = dynamic(() => import('@/components/Header'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })
const FloatingChat = dynamic(() => import('@/components/FloatingChat'), { ssr: false })
const ToastContainer = dynamic(() => import('@/components/ToastContainer'), { ssr: false })

export default function ClientProviders({ children, hideShell = false }) {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        {!hideShell && <Header />}
        {children}
        {!hideShell && <Footer />}
        {!hideShell && <FloatingChat />}
        <ToastContainer />
      </ToastProvider>
    </AdminAuthProvider>
  )
}
