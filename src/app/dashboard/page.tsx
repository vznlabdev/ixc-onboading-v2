'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  User,
  ArrowLeft,
} from 'lucide-react';
import ApplicationStatus from '@/components/dashboard/ApplicationStatus';
import ApplicationPreview from '@/components/dashboard/ApplicationPreview';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, userEmail, onboardingData, applicationStatus, submittedAt, isLoading, signOut } = useUser();

  // Debug logging
  React.useEffect(() => {
    console.log('Dashboard - onboardingData:', onboardingData);
    console.log('Dashboard - isAuthenticated:', isAuthenticated);
    console.log('Dashboard - userEmail:', userEmail);
  }, [onboardingData, isAuthenticated, userEmail]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signup');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = () => {
    signOut();
    router.push('/signup');
  };

  const handleBackToOnboarding = () => {
    router.push('/onboarding');
  };

  // Show loading if checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Show message if no onboarding data or incomplete
  const hasOnboardingData = onboardingData && (
    onboardingData.businessProfile.businessName ||
    onboardingData.customers.length > 0 ||
    onboardingData.bankConnection.bankName ||
    onboardingData.invoices.length > 0
  );

  if (!hasOnboardingData && applicationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 h-16 flex items-center px-6">
          <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 relative">
                <Image
                  src="/incoxchange-logomark.svg"
                  alt="IncoXchange Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-base font-semibold text-black">
                incoXchange
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">
                {userEmail}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto py-20 px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-3 tracking-tight">
              Welcome to IncoXchange
            </h2>
            <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
              Complete your onboarding to get started with your account.
            </p>
            <Button
              onClick={handleBackToOnboarding}
              className="bg-black hover:bg-gray-800 text-white h-10 px-6 rounded-md text-sm font-medium"
            >
              Start Onboarding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Vercel Style */}
      <div className="border-b border-gray-200 h-16 flex items-center px-6">
        <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 relative">
              <Image
                src="/incoxchange-logomark.svg"
                alt="IncoXchange Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-base font-semibold text-black">
              incoXchange
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {userEmail}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto py-8 px-6">
        {/* User Profile Section - Vercel Style */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            {/* Simple Avatar */}
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-xl font-semibold">
              {(() => {
                const businessName = onboardingData?.businessProfile?.businessName;
                if (businessName) {
                  return businessName
                    .split(/\s+/)
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                }
                return userEmail
                  ?.split('@')[0]
                  .split(/[._-]/)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'U';
              })()}
            </div>

            <div>
              {/* Business/User Name */}
              <h2 className="text-2xl font-bold text-black mb-1 tracking-tight">
                {onboardingData?.businessProfile?.businessName || 
                 userEmail?.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 
                 'User'}
              </h2>

              {/* User Email */}
              <p className="text-sm text-gray-600">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Business Info Tags */}
          {onboardingData?.businessProfile && (
            <div className="flex gap-2 flex-wrap">
              {onboardingData.businessProfile.businessType && (
                <div className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-700 capitalize">
                  {onboardingData.businessProfile.businessType.replace('_', ' ')}
                </div>
              )}
              {onboardingData.businessProfile.industry && (
                <div className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-700 capitalize">
                  {onboardingData.businessProfile.industry.replace('_', ' ')}
                </div>
              )}
              {onboardingData.businessProfile.ein && (
                <div className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 font-mono">
                  EIN: {onboardingData.businessProfile.ein}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Continue/Back to Onboarding Button (only show if not submitted) */}
        {applicationStatus === 'pending' && (
          <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-yellow-900 mb-1">
                  Application Not Submitted
                </p>
                <p className="text-sm text-yellow-800">
                  Your application is incomplete. Continue where you left off to submit it for review.
                </p>
              </div>
              <Button
                onClick={handleBackToOnboarding}
                size="sm"
                className="bg-black hover:bg-gray-800 text-white h-9 px-4 rounded-md text-sm flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Left Column - Application Status */}
          <div className="lg:sticky lg:top-6">
            <ApplicationStatus status={applicationStatus} submittedAt={submittedAt} />
          </div>

          {/* Right Column - Application Preview */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black mb-1 tracking-tight">
                Application Details
              </h3>
              <p className="text-sm text-gray-600">
                Review the information you submitted for your application.
              </p>
            </div>
            <ApplicationPreview data={onboardingData!} />
          </div>
        </div>

        {/* Bottom Action - Edit Application (only if pending) */}
        {applicationStatus === 'pending' && (
          <div className="mt-12 p-6 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-4">
              Need to make changes to your application?
            </p>
            <Button
              variant="outline"
              onClick={handleBackToOnboarding}
              className="h-9 px-6 rounded-md text-sm font-medium border-gray-300 hover:bg-gray-50"
            >
              Edit Application
            </Button>
          </div>
        )}

        {/* Note about editing */}
        {applicationStatus !== 'pending' && (
          <div className="mt-12 p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Your application is currently {applicationStatus === 'under_review' ? 'under review' : applicationStatus}. 
              {applicationStatus === 'under_review' && ' You cannot make changes while the application is being reviewed.'}
              {applicationStatus === 'approved' && ' If you need to update your information, please contact support.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
