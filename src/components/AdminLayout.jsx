'use client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from '@/components/AdminLogin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/ToastContext';
import { Settings, FileText, MessageSquare, LogOut, Shield, Home, User, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
export default function AdminLayout({ children, title, description }) {
    const { isAuthenticated, logout } = useAdminAuth();
    const { success } = useToast();
    const pathname = usePathname();
    if (!isAuthenticated) {
        return <AdminLogin />;
    }
    const handleLogout = () => {
        logout();
        success('Logged Out', 'You have been successfully logged out');
    };
    const navigation = [
        {
            name: 'Applications',
            href: '/admin/applications',
            icon: FileText,
            description: 'Manage grant applications'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            description: 'System configuration'
        },
        {
            name: 'Support Chat',
            href: '/support',
            icon: MessageSquare,
            description: 'Support dashboard'
        }
    ];
    const isCurrentPage = (href) => pathname === href;
    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="w-5 h-5"/>
                <span className="font-medium">Back to Site</span>
              </Link>
              
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                <Shield className="w-4 h-4 text-blue-600"/>
                <span className="text-sm font-medium text-blue-800">Admin Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4"/>
                <span>Administrator</span>
              </div>
              
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4"/>
                <span>Session: 24h</span>
              </div>
              
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                <LogOut className="w-4 h-4 mr-2"/>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Tools</h2>
              
              <nav className="space-y-2">
                {navigation.map((item) => {
            const Icon = item.icon;
            const current = isCurrentPage(item.href);
            return (<Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${current
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                      <Icon className={`w-5 h-5 ${current ? 'text-blue-600' : 'text-gray-400'}`}/>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${current ? 'text-blue-600' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>);
        })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {(title || description) && (<div className="mb-8">
                {title && (<h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>)}
                {description && (<p className="text-lg text-gray-600">{description}</p>)}
              </div>)}
            
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>);
}
