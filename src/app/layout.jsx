import './globals.css'
import ClientProviders from '@/components/ClientProviders'

export const metadata = {
  title: 'Impact Grant Solutions - Empowering Women Worldwide',
  description: 'Access life-changing grants designed to empower women worldwide.',
  keywords: 'grants, women empowerment, funding, applications',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <main className="pt-24">{children}</main>
        </ClientProviders>
      </body>
    </html>
  )
}
