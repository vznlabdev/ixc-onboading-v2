'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import WelcomeStep from '@/components/onboarding/WelcomeStep';

export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < 6) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Complete onboarding
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} onSkip={handleSkip} />;
      case 1:
        return <div>Business Profile - Coming Soon</div>;
      case 2:
        return <div>Customers - Coming Soon</div>;
      case 3:
        return <div>Bank Connect - Coming Soon</div>;
      case 4:
        return <div>Invoices - Coming Soon</div>;
      case 5:
        return <div>Factoring Agreement - Coming Soon</div>;
      case 6:
        return <div>Review - Coming Soon</div>;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout activeStep={activeStep}>
      {renderStepContent()}
    </OnboardingLayout>
  );
}

