import ClientProviders from '@/components/ClientProviders'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // hideShell=true will avoid rendering Header/Footer/FloatingChat in admin area
  return (
    <ClientProviders hideShell={true}>
      {children}
    </ClientProviders>
  )
}
