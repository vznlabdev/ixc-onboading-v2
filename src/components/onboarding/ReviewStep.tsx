'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  Landmark,
  FileText,
  CheckCircle,
  Pencil,
} from 'lucide-react';

interface ReviewStepProps {
  onNext: () => void;
  onSkip: () => void;
  onEdit?: (step: number) => void;
  data?: {
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
  };
}

export default function ReviewStep({
  onNext,
  onSkip,
  onEdit,
  data,
}: ReviewStepProps) {
  console.log('ReviewStep - Received data:', data);
  
  // Transform data for display
  const reviewData = {
    business: {
      name: data?.businessProfile.businessName || 'Not provided',
      type: data?.businessProfile.businessType || 'Not provided',
      industry: data?.businessProfile.industry || 'Not provided',
      ein: data?.businessProfile.ein || 'Not provided',
      address: data?.businessProfile.city && data?.businessProfile.state 
        ? `${data.businessProfile.city}, ${data.businessProfile.state}` 
        : 'Not provided',
    },
    customers: data?.customers.map(c => ({
      name: c.customerName,
      contact: c.contactPerson,
    })) || [],
    bank: {
      name: data?.bankConnection.bankName || 'Not connected',
      connected: !!data?.bankConnection.bankName,
    },
    invoices: {
      count: data?.invoices.length || 0,
      totalAmount: '$0.00', // Could calculate if you store amounts
    },
  };

  const sections = [
    {
      title: 'Business Profile',
      icon: Building2,
      step: 1,
      completed: !!(data?.businessProfile.businessName && data?.businessProfile.ein),
      content: (
        <div>
          <p className="text-sm text-[#535862] mb-2">
            <strong className="text-[#181D27]">{reviewData.business.name}</strong>
          </p>
          <p className="text-sm text-[#535862]">
            {reviewData.business.type} • {reviewData.business.industry}
          </p>
          <p className="text-sm text-[#535862]">
            EIN: {reviewData.business.ein}
          </p>
          <p className="text-sm text-[#535862]">
            {reviewData.business.address}
          </p>
        </div>
      ),
    },
    {
      title: 'Customers',
      icon: Users,
      step: 2,
      completed: reviewData.customers.length > 0,
      content: (
        <div>
          <p className="text-sm text-[#535862] mb-2">
            {reviewData.customers.length} customer{reviewData.customers.length !== 1 ? 's' : ''} added
          </p>
          {reviewData.customers.slice(0, 2).map((customer, index) => (
            <p key={index} className="text-sm text-[#535862]">
              • {customer.name} ({customer.contact})
            </p>
          ))}
          {reviewData.customers.length > 2 && (
            <p className="text-sm text-[#717680] italic">
              +{reviewData.customers.length - 2} more
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'Bank Account',
      icon: Landmark,
      step: 3,
      completed: reviewData.bank.connected,
      content: (
        <div>
          <p className="text-sm text-[#535862]">
            <strong className="text-[#181D27]">{reviewData.bank.name}</strong> account connected
          </p>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">
              Verified and active
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Invoices',
      icon: FileText,
      step: 4,
      completed: reviewData.invoices.count > 0,
      content: (
        <div>
          <p className="text-sm text-[#535862] mb-1">
            {reviewData.invoices.count} invoice{reviewData.invoices.count !== 1 ? 's' : ''} uploaded
          </p>
          <p className="text-sm text-[#535862]">
            Total amount: <strong className="text-[#181D27]">{reviewData.invoices.totalAmount}</strong>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">
              All invoices verified
            </span>
          </div>
        </div>
      ),
    },
  ];

  const allCompleted = sections.every(s => s.completed);

  return (
    <div className="flex flex-col items-center min-h-full px-4 sm:px-8 py-8 sm:py-12 max-w-[700px] mx-auto">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4 text-center">
        Review your information
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base font-normal text-[#535862] mb-12 text-center max-w-[600px]">
        Please review your details before proceeding to sign the factoring agreement.
      </p>

      {/* Review Sections */}
      <div className="w-full flex flex-col gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="border border-[#E9EAEB]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        section.completed ? 'bg-[#eff6ff] text-[#2164ef]' : 'bg-[#F5F5F5] text-[#717680]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#181D27]">
                        {section.title}
                      </h3>
                      {section.completed && (
                        <Badge className="h-5 text-[0.625rem] font-medium bg-[#d1fae5] text-[#065f46] hover:bg-[#d1fae5] mt-1">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(section.step)}
                      className="text-xs font-medium text-[#2164ef] hover:bg-[#eff6ff] h-auto py-1 px-2"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                <Separator className="mb-4" />

                {section.content}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Status */}
      {allCompleted && (
        <div className="w-full mt-8 p-6 bg-[#eff6ff] rounded-lg border border-[#bedcff] text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[#2164ef]" />
            <span className="text-sm font-semibold text-[#2164ef]">
              All steps completed
            </span>
          </div>
          <p className="text-xs font-normal text-[#535862]">
            You&apos;re ready to sign the factoring agreement
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mt-12 w-full items-center">
        <Button
          onClick={onNext}
          aria-label="Proceed to sign agreement"
          className="px-8 py-2 text-sm font-medium rounded-lg min-w-[150px]"
        >
          Continue to Agreement
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-sm text-[#535862] hover:bg-transparent hover:underline"
        >
          Save and finish later
        </Button>
      </div>
    </div>
  );
}
