'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();
    const { success, error } = useToast();
    const router = useRouter(); // Initialize useRouter
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const loginSuccess = await login(password); // Ensure login is awaited
            if (loginSuccess) {
                success('Login Successful', 'Welcome to the admin dashboard');
                setPassword('');
                router.push('/admin'); // Redirect to admin dashboard
            }
            else {
                error('Login Failed', 'Invalid password. Please try again.');
            }
        }
        catch (err) {
            error('Login Error', 'An unexpected error occurred. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white"/>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Access
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter your admin password to access the dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="pr-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20" required/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoading}>
                  {showPassword ? (<EyeOff className="w-4 h-4"/>) : (<Eye className="w-4 h-4"/>)}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !password.trim()} size="lg">
              {isLoading ? (<div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>) : (<div className="flex items-center gap-2">
                  <Lock className="w-4 h-4"/>
                  Access Dashboard
                </div>)}
            </Button>
          </form>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"/>
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Security Notice</p>
                <p className="text-amber-700">
                  Your session will remain active for 24 hours. Always log out when finished.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);
}

