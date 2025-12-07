'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mail, Clock, RefreshCw, ArrowRight } from 'lucide-react';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(15 * 60);
    }, 1000);
  };

  const handleSkipToOnboarding = () => {
    // Reset application status to allow re-entering onboarding
    // This is useful for demo purposes or if user wants to restart the process
    if (typeof window !== 'undefined') {
      localStorage.removeItem('applicationStatus');
      localStorage.removeItem('submittedAt');
      localStorage.removeItem('approvedAt');
      localStorage.removeItem('rejectedAt');
      localStorage.removeItem('rejectionReason');
      localStorage.removeItem('reviewNotes');
      localStorage.removeItem('creditTerms');
    }
    router.push('/onboarding');
  };

  const progress = ((15 * 60 - timeLeft) / (15 * 60)) * 100;

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

      {/* Left Side - Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-16 py-8 max-w-full md:max-w-[50%] min-h-screen">
        <div className="w-full max-w-[500px]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-foreground mb-4 text-center">
            Check your email
          </h1>

          {/* Description */}
          <p className="text-base text-muted-foreground mb-8 leading-relaxed text-center">
            We sent a magic link to <strong className="text-foreground">{email}</strong>
          </p>

          {/* Timer Section */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Link expires in
              </span>
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-muted p-4 mb-6 space-y-2">
            <p className="text-sm font-medium">Next steps:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open the email we sent you</li>
              <li>Click the magic link to verify</li>
              <li>You'll be redirected automatically</li>
            </ol>
          </div>

          {/* Resend Button */}
          <Button
            variant="outline"
            className="w-full h-11 mb-4"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend magic link
              </>
            )}
          </Button>

          {/* Demo Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Demo Only
              </span>
            </div>
          </div>

          {/* Skip Button */}
          <Button
            variant="secondary"
            className="w-full h-11"
            onClick={handleSkipToOnboarding}
          >
            Skip to Onboarding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Help Text */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive an email?{' '}
            <button
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
            >
              Check spam folder
            </button>
          </p>
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
        style={{ backgroundImage: 'url(/images/bg-female-phone.png)' }}
      />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
