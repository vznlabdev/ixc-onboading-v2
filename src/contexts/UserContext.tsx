'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface UserContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  onboardingData: OnboardingData | null;
  applicationStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date | null;
  isLoading: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  saveOnboardingData: (data: OnboardingData) => void;
  submitApplication: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'under_review' | 'approved' | 'rejected'>('pending');
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedEmail = localStorage.getItem('userEmail');
    const savedOnboardingData = localStorage.getItem('onboardingData');
    const savedStatus = localStorage.getItem('applicationStatus');
    const savedSubmittedAt = localStorage.getItem('submittedAt');

    console.log('Loaded onboarding data from localStorage:', savedOnboardingData);

    if (savedAuth === 'true' && savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
      console.log('User authenticated:', savedEmail);
    }

    if (savedOnboardingData) {
      try {
        const parsed = JSON.parse(savedOnboardingData);
        console.log('Parsed onboarding data:', parsed);
        setOnboardingData(parsed);
      } catch (e) {
        console.error('Error parsing onboarding data:', e);
      }
    }

    if (savedStatus) {
      setApplicationStatus(savedStatus as any);
    }

    if (savedSubmittedAt) {
      setSubmittedAt(new Date(savedSubmittedAt));
    }

    setIsLoading(false);
  }, []);

  const signIn = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setOnboardingData(null);
    setApplicationStatus('pending');
    setSubmittedAt(null);
    localStorage.clear();
  };

  const saveOnboardingData = (data: OnboardingData) => {
    console.log('Saving onboarding data:', data);
    setOnboardingData(data);
    localStorage.setItem('onboardingData', JSON.stringify(data));
    console.log('Saved to localStorage:', localStorage.getItem('onboardingData'));
  };

  const submitApplication = () => {
    const now = new Date();
    setApplicationStatus('under_review');
    setSubmittedAt(now);
    localStorage.setItem('applicationStatus', 'under_review');
    localStorage.setItem('submittedAt', now.toISOString());
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        onboardingData,
        applicationStatus,
        submittedAt,
        isLoading,
        signIn,
        signOut,
        saveOnboardingData,
        submitApplication,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

