'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface ApplicationStatusProps {
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date | null;
}

export default function ApplicationStatus({ status, submittedAt }: ApplicationStatusProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Not Submitted',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300',
          icon: <Clock className="w-4 h-4" />,
          progress: 0,
          message: 'Your application has not been submitted yet.',
        };
      case 'under_review':
        return {
          label: 'Under Review',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          progress: 50,
          message: 'Your application is being reviewed by our team. This typically takes 2-3 business days.',
        };
      case 'approved':
        return {
          label: 'Approved',
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: <CheckCircle className="w-4 h-4" />,
          progress: 100,
          message: 'Congratulations! Your application has been approved. You can now start using all features.',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          progress: 100,
          message: 'Your application was not approved. Please contact support for more information.',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const activeStep = status === 'pending' ? 0 : status === 'under_review' ? 1 : 2;

  const steps = [
    { label: 'Submitted', description: 'Application received' },
    { label: 'Under Review', description: 'Being evaluated' },
    { label: status === 'rejected' ? 'Decision' : 'Approved', description: status === 'rejected' ? 'Application decision' : 'Ready to use' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="border border-gray-200 rounded-lg shadow-none">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-base font-semibold text-black">
            Application Status
          </h3>
          <Badge
            className={`flex items-center gap-1.5 font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border px-2.5 py-0.5 hover:${statusInfo.bgColor}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>

        {/* Status Message */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {statusInfo.message}
        </p>

        {/* Submitted Date */}
        {submittedAt && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              Submitted On
            </p>
            <p className="text-sm text-gray-900 font-mono">
              {formatDate(submittedAt)}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {status !== 'pending' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-900">
                Progress
              </span>
              <span className={`text-xs font-semibold ${statusInfo.color}`}>
                {statusInfo.progress}%
              </span>
            </div>
            <Progress value={statusInfo.progress} className="h-1.5" />
          </div>
        )}

        {/* Stepper */}
        {status !== 'pending' && (
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep || status === 'approved' || status === 'rejected';
              const isCurrent = index === activeStep;
              
              return (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isCompleted
                          ? status === 'rejected' && index === 2
                            ? 'bg-red-600 text-white'
                            : 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-black text-white'
                          : 'border-2 border-gray-300 text-gray-400 bg-white'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-6 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <p
                      className={`text-sm mb-0.5 ${
                        index <= activeStep ? 'font-medium text-black' : 'font-normal text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Estimated Time */}
        {status === 'under_review' && (
          <div className="mt-6 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
            <p className="text-xs font-medium text-yellow-900 mb-1">
              Estimated Review Time
            </p>
            <p className="text-sm text-yellow-800">
              2-3 business days
            </p>
          </div>
        )}

        {/* Approved Message */}
        {status === 'approved' && (
          <div className="mt-6 p-3 border border-emerald-200 bg-emerald-50 rounded-lg">
            <p className="text-sm font-medium text-emerald-900 mb-1">
              Welcome to IncoXchange!
            </p>
            <p className="text-xs text-emerald-800">
              Your account is now fully activated. You can start managing your invoices and accessing funding.
            </p>
          </div>
        )}

        {/* Contact Support */}
        {(status === 'under_review' || status === 'rejected') && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Questions? Contact us at{' '}
              <a
                href="mailto:help@incoxchange.com"
                className="text-black font-medium hover:underline"
              >
                help@incoxchange.com
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
