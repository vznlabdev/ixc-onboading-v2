'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useUser();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      signIn(email);
      router.push(`/signup/verify?email=${encodeURIComponent(email)}`);
    }, 800);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Logo - Top Left Corner */}
      <div className="absolute top-6 left-6 sm:left-8 md:left-12 z-10 flex items-center gap-3">
        <Image
          src="/incoxchange-logomark.svg"
          alt="IncoXchange Logo"
          width={32}
          height={32}
        />
        <span className="text-lg font-semibold text-foreground">
          incoXchange
        </span>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-16 py-8 max-w-full md:max-w-[50%] min-h-screen">
        <div className="w-full max-w-[500px]">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-foreground mb-4">
            Welcome back
          </h1>

          {/* Description */}
          <p className="text-base text-muted-foreground mb-6 leading-relaxed">
            Sign in to your IncoXchange account to continue managing your business finances
          </p>

          {/* Sign Up Link */}
          <p className="text-sm text-muted-foreground mb-6">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="h-11"
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Send me a magic link'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 sm:left-8 md:left-12 right-6 sm:right-8 md:max-w-[calc(50%-96px)] flex justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">© IncoXchange 2025</p>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          help@incoxchange.com
        </p>
      </div>

      {/* Right Side - Hero Image */}
      <div
        className="hidden md:block flex-1 bg-cover bg-center bg-muted"
        style={{ backgroundImage: 'url(/images/female-fruits.jpg)' }}
      />
    </div>
  );
}
