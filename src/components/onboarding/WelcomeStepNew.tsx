'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2, Users, Banknote, FileText } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const features = [
  {
    icon: Building2,
    title: 'Business Profile',
    description: 'Share your company details and information',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Add and manage your client relationships',
  },
  {
    icon: Banknote,
    title: 'Banking Integration',
    description: 'Securely connect your business account',
  },
  {
    icon: FileText,
    title: 'Invoice Processing',
    description: 'Upload and manage your invoices',
  },
];

export default function WelcomeStepNew({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Welcome to IncoXchange
          </CardTitle>
          <CardDescription className="text-base">
            Let's get your account set up. This should only take a few minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">What you'll need:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Business information and EIN</li>
              <li>Customer details (optional)</li>
              <li>Bank account information</li>
              <li>Recent invoices (optional)</li>
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              onClick={onSkip}
            >
              Skip for now
            </Button>
            <Button onClick={onNext}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

