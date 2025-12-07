'use client';

import React from 'react';
import Image from 'next/image';
import { 
  SmilePlus, 
  Building2, 
  Users, 
  Link as LinkIcon, 
  FileText, 
  FileCheck, 
  CheckCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingStep {
  label: string;
  description: string;
  icon: React.ReactElement;
}

const steps: OnboardingStep[] = [
  {
    label: 'Welcome',
    description: 'Get started with your setup.',
    icon: <SmilePlus className="w-5 h-5" />,
  },
  {
    label: 'Business Profile',
    description: 'Add your company details.',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    label: 'Customers',
    description: 'Add your clients or partners.',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Bank Connect',
    description: 'Securely link your account.',
    icon: <LinkIcon className="w-5 h-5" />,
  },
  {
    label: 'Invoices',
    description: 'Upload your invoices.',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Review',
    description: 'Check and confirm setup.',
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    label: 'Factoring Agreement',
    description: 'Sign the agreement.',
    icon: <FileCheck className="w-5 h-5" />,
  },
];

interface OnboardingLayoutProps {
  activeStep: number;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  activeStep,
  children,
}: OnboardingLayoutProps) {
  const progress = ((activeStep + 1) / 7) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#E9EAEB]">
        <div
          className="h-full bg-gradient-to-r from-[#491ae6] to-[#2164ef] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-4 bg-white border-b border-[#E9EAEB]">
        <div className="flex items-center gap-3">
          <Image
            src="/incoxchange-logomark.svg"
            alt="IncoXchange Logo"
            width={24}
            height={24}
          />
          <span className="text-base font-semibold text-[#181D27]">
            incoXchange
          </span>
        </div>
        <span className="text-sm text-[#535862]">
          Step {activeStep + 1} of 7
        </span>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar - Steps */}
        <div className="hidden md:block w-80 bg-[#F5F5F5] border-r border-[#E9EAEB] p-6 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/incoxchange-logomark.svg"
              alt="IncoXchange Logo"
              width={32}
              height={32}
            />
            <span className="text-lg font-semibold text-[#181D27]">
              incoXchange
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center",
                    index === activeStep
                      ? "bg-[#daeaff] border-[#2164ef] text-[#2164ef]"
                      : "bg-transparent border-[#E9EAEB] text-[#717680]"
                  )}
                >
                  {step.icon}
                </div>

                {/* Label & Description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm leading-tight",
                      index === activeStep
                        ? "font-semibold text-[#181D27]"
                        : "font-medium text-[#181D27]"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm font-normal text-[#717680] leading-tight mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[41px] top-[50px] w-0.5 h-6 bg-[#E9EAEB]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white w-full md:w-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
