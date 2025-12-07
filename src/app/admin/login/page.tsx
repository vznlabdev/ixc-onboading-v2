'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Shield, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);
    
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black tracking-tight">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to manage applications
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@incoxchange.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-black">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-mono">admin@incoxchange.com</span> / admin123
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-mono">reviewer@incoxchange.com</span> / reviewer123
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
              ← Back to main site
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:block lg:w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Image
              src="/incoxchange-logomark.svg"
              alt="IncoXchange"
              width={32}
              height={32}
              className="invert"
            />
            <span className="text-white font-semibold text-lg">IncoXchange</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Streamline your<br />
              application reviews
            </h2>
            <p className="text-gray-400 text-lg">
              Efficiently manage and approve business applications with our comprehensive admin dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white font-semibold">8</span>
              </div>
              <div>
                <p className="text-white font-medium">Applications pending</p>
                <p className="text-gray-400 text-sm">Requires immediate attention</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white font-semibold">91%</span>
              </div>
              <div>
                <p className="text-white font-medium">Approval rate</p>
                <p className="text-gray-400 text-sm">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
