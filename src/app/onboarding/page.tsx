'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import BusinessProfileStep from '@/components/onboarding/BusinessProfileStep';
import CustomersStep from '@/components/onboarding/CustomersStep';
import BankConnectStep from '@/components/onboarding/BankConnectStep';
import InvoicesStep from '@/components/onboarding/InvoicesStep';
import ReviewStep from '@/components/onboarding/ReviewStep';
import FactoringAgreementStep from '@/components/onboarding/FactoringAgreementStep';

interface OnboardingData {
  businessProfile: {
    businessName: string;
    businessType: string;
    industry: string;
    ein: string;
    state: string;
    city: string;
    street: string;
    building: string;
    zip: string;
  };
  customers: Array<{
    customerName: string;
    contactPerson: string;
    email: string;
    phone: string;
    billingAddress: string;
  }>;
  bankConnection: {
    bankId: string;
    bankName: string;
    isManual: boolean;
  };
  invoices: Array<{
    name: string;
    size: number;
  }>;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessProfile: {
      businessName: '',
      businessType: '',
      industry: '',
      ein: '',
      state: '',
      city: '',
      street: '',
      building: '',
      zip: '',
    },
    customers: [],
    bankConnection: {
      bankId: '',
      bankName: '',
      isManual: false,
    },
    invoices: [],
  });

  const handleNext = () => {
    // If editing from review, return to review
    if (isEditingFromReview) {
      setActiveStep(5); // Review step
      setIsEditingFromReview(false);
    } else if (activeStep < 6) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Complete onboarding
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    // If editing from review, go back to review
    if (isEditingFromReview) {
      setActiveStep(5); // Review step
      setIsEditingFromReview(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleEdit = (step: number) => {
    setActiveStep(step);
    setIsEditingFromReview(true);
  };

  const updateBusinessProfile = (data: OnboardingData['businessProfile']) => {
    setOnboardingData(prev => ({ ...prev, businessProfile: data }));
  };

  const updateCustomers = (customers: OnboardingData['customers']) => {
    setOnboardingData(prev => ({ ...prev, customers }));
  };

  const updateBankConnection = (bank: OnboardingData['bankConnection']) => {
    setOnboardingData(prev => ({ ...prev, bankConnection: bank }));
  };

  const updateInvoices = (invoices: OnboardingData['invoices']) => {
    setOnboardingData(prev => ({ ...prev, invoices }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} onSkip={handleSkip} />;
      case 1:
        return (
          <BusinessProfileStep 
            onNext={handleNext} 
            onSkip={handleSkip}
            initialData={onboardingData.businessProfile}
            onSave={updateBusinessProfile}
          />
        );
      case 2:
        return (
          <CustomersStep 
            onNext={handleNext} 
            onSkip={handleSkip}
            initialCustomers={onboardingData.customers}
            onSave={updateCustomers}
          />
        );
      case 3:
        return (
          <BankConnectStep 
            onNext={handleNext} 
            onSkip={handleSkip}
            initialBank={onboardingData.bankConnection}
            onSave={updateBankConnection}
          />
        );
      case 4:
        return (
          <InvoicesStep 
            onNext={handleNext} 
            onSkip={handleSkip}
            initialInvoices={onboardingData.invoices}
            onSave={updateInvoices}
          />
        );
      case 5:
        return (
          <ReviewStep 
            onNext={handleNext} 
            onSkip={handleSkip} 
            onEdit={handleEdit}
            data={onboardingData}
          />
        );
      case 6:
        return <FactoringAgreementStep onNext={handleNext} onSkip={handleSkip} />;
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

