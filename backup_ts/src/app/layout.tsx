import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'Impact Grant Solutions - Empowering Women Worldwide',
  description: 'Access life-changing grants designed to empower women worldwide.',
  keywords: 'grants, women empowerment, funding, applications',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ClientProviders is a client-only component that contains Header/Footer and providers */}
        <ClientProviders>
          <main className="pt-24">{children}</main>
        </ClientProviders>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingChat from '@/components/FloatingChat'
import { ToastProvider } from '@/contexts/ToastContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import ToastContainer from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: 'Impact Grant Solutions - Empowering Women Worldwide',
  description: 'Access life-changing grants designed to empower women worldwide.',
  keywords: 'grants, women empowerment, funding, applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>
          <ToastProvider>
            <Header />
            <main className="pt-24">
              {children}
            </main>
            <Footer />
            <FloatingChat />
            <ToastContainer />
          </ToastProvider>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
