import ClientProviders from '@/components/ClientProviders';

export default function AdminRootLayout({ children }) {
  return (
    <ClientProviders hideShell={true}>
      {children}
    </ClientProviders>
  );
}
