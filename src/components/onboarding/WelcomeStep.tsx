'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4 sm:px-8 py-8 sm:py-12">
      {/* Logo */}
      <Image
        src="/incoxchange-logomark.svg"
        alt="IncoXchange Logo"
        width={80}
        height={80}
        className="w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8"
      />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4 sm:mb-6 leading-tight">
        Welcome to IncoXchange
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg font-normal text-[#535862] mb-6 sm:mb-8 max-w-[600px] leading-relaxed">
        Let&apos;s get your business set up to manage invoices, customers, and payments.
      </p>

      {/* Additional Info */}
      <p className="text-sm sm:text-base font-normal text-[#535862] mb-8 sm:mb-12 max-w-[600px] leading-normal">
        We&apos;ll guide you through a few quick steps to personalize your account and enable funding. It only takes a few minutes, you can save and resume anytime.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        <Button
          onClick={onNext}
          aria-label="Start onboarding setup"
          size="lg"
        >
          Start setup
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}

