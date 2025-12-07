'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  Landmark,
  FileText,
} from 'lucide-react';

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

interface ApplicationPreviewProps {
  data: OnboardingData;
}

export default function ApplicationPreview({ data }: ApplicationPreviewProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Business Profile Section */}
      <Card className="border border-gray-200 rounded-lg shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
              <Building2 className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-black">
              Business Profile
            </h3>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                Business Name
              </p>
              <p className="text-sm text-gray-900">
                {data.businessProfile.businessName || 'Not provided'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">
                  Business Type
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {data.businessProfile.businessType.replace('_', ' ') || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">
                  Industry
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {data.businessProfile.industry.replace('_', ' ') || 'Not provided'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                EIN
              </p>
              <p className="text-sm text-gray-900 font-mono">
                {data.businessProfile.ein || 'Not provided'}
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm font-medium text-black mb-3">
                Business Address
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.businessProfile.street && `${data.businessProfile.street}, `}
                {data.businessProfile.building && `${data.businessProfile.building}, `}
                {data.businessProfile.city && `${data.businessProfile.city}, `}
                {data.businessProfile.state && `${data.businessProfile.state} `}
                {data.businessProfile.zip || ''}
                {!data.businessProfile.street && !data.businessProfile.city && 'Address not provided'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Section */}
      <Card className="border border-gray-200 rounded-lg shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
              <Users className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-black flex-1">
              Customers
            </h3>
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 font-medium hover:bg-gray-100 text-xs">
              {data.customers.length}
            </Badge>
          </div>

          {data.customers.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No customers added
            </p>
          ) : (
            <div className="space-y-4">
              {data.customers.map((customer, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <p className="text-sm font-medium text-black mb-3">
                    {customer.customerName}
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-500">Contact:</span> {customer.contactPerson}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-500">Email:</span> {customer.email}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-500">Phone:</span> {customer.phone}
                    </p>
                    {customer.billingAddress && (
                      <p className="text-xs text-gray-600">
                        <span className="text-gray-500">Address:</span> {customer.billingAddress}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Connection Section */}
      <Card className="border border-gray-200 rounded-lg shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
              <Landmark className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-black">
              Bank Connection
            </h3>
          </div>

          {!data.bankConnection.bankName ? (
            <p className="text-sm text-gray-500 italic">
              No bank connected
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">
                  Bank Name
                </p>
                <p className="text-sm text-gray-900">
                  {data.bankConnection.bankName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  Connection Type
                </p>
                <Badge
                  className={`${
                    data.bankConnection.isManual
                      ? 'bg-gray-100 text-gray-700 border-gray-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  } font-medium hover:bg-current text-xs border`}
                >
                  {data.bankConnection.isManual ? 'Manual' : 'Automated'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices Section */}
      <Card className="border border-gray-200 rounded-lg shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-base font-semibold text-black flex-1">
              Invoices
            </h3>
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 font-medium hover:bg-gray-100 text-xs">
              {data.invoices.length}
            </Badge>
          </div>

          {data.invoices.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No invoices uploaded
            </p>
          ) : (
            <div className="space-y-2">
              {data.invoices.map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <p className="text-sm text-gray-900 truncate">
                      {invoice.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 font-mono ml-3 flex-shrink-0">
                    {formatBytes(invoice.size)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
