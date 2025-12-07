'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export interface OnboardingStep {
  label: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    label: 'Welcome',
    description: 'Get started',
  },
  {
    label: 'Business Profile',
    description: 'Company details',
  },
  {
    label: 'Customers',
    description: 'Add clients',
  },
  {
    label: 'Bank Account',
    description: 'Connect banking',
  },
  {
    label: 'Invoices',
    description: 'Upload documents',
  },
  {
    label: 'Review',
    description: 'Confirm details',
  },
  {
    label: 'Agreement',
    description: 'Sign & complete',
  },
];

interface OnboardingLayoutProps {
  activeStep: number;
  children: React.ReactNode;
}

export default function OnboardingLayoutNew({
  activeStep,
  children,
}: OnboardingLayoutProps) {
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-foreground" />
            <span className="font-semibold">IncoXchange</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Steps */}
              <nav className="space-y-1">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isCompleted = index < activeStep;

                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex items-start gap-3 rounded-lg p-3 transition-colors',
                        isActive && 'bg-muted',
                        !isActive && !isCompleted && 'opacity-50'
                      )}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        ) : (
                          <Circle
                            className={cn(
                              'h-5 w-5',
                              isActive ? 'fill-primary text-primary' : 'text-muted-foreground'
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p
                          className={cn(
                            'text-sm font-medium leading-none',
                            isActive && 'text-foreground',
                            !isActive && 'text-muted-foreground'
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mx-auto max-w-3xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

