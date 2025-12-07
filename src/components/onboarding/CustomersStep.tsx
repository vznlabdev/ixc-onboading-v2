'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Phone, Trash2, Plus } from 'lucide-react';

interface Customer {
  customerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
}

interface CustomersStepProps {
  onNext: () => void;
  onSkip: () => void;
  initialCustomers?: Customer[];
  onSave?: (customers: Customer[]) => void;
}

export default function CustomersStep({
  onNext,
  onSkip,
  initialCustomers,
  onSave,
}: CustomersStepProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers || []);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    billingAddress: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form and errors
    setFormData({
      customerName: '',
      contactPerson: '',
      email: '',
      phone: '',
      billingAddress: '',
    });
    setErrors({});
  };

  const handleAddCustomer = () => {
    if (validateForm()) {
      setCustomers([...customers, formData]);
      handleCloseDialog();
    }
  };

  const handleRemoveCustomer = (index: number) => {
    setCustomers(customers.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    // Save customers data
    if (onSave) {
      onSave(customers);
    }
    console.log('All customers:', customers);
    onNext();
  };

  return (
    <div className="flex flex-col items-center min-h-full px-4 sm:px-8 py-8 sm:py-12 max-w-[600px] mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-[#181D27] mb-4 text-center">
        Add your customers
      </h1>

      {/* Description */}
      <p className="text-base font-normal text-[#535862] mb-4 text-center max-w-[500px]">
        Create customer records to send invoices and track payments.
      </p>

      {/* Additional Info */}
      <p className="text-sm font-normal text-[#717680] mb-8 text-center max-w-[500px]">
        You can add your regular customers now or skip and add them later from your dashboard.
      </p>

      {/* Customers List or Empty State */}
      <div className="w-full mb-8">
        {customers.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50">
            <p className="text-sm text-gray-600 mb-4">
              No customers added yet
            </p>
            <Button
              onClick={handleOpenDialog}
              size="default"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold text-[#181D27]">
                Customers ({customers.length})
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenDialog}
                className="text-xs font-medium rounded-lg"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Another
              </Button>
            </div>
            <div className="border border-[#E9EAEB] rounded-lg bg-white divide-y divide-[#E9EAEB]">
              {customers.map((customer, index) => (
                <div
                  key={index}
                  className="p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#181D27] mb-1">
                      {customer.customerName}
                    </p>
                    <p className="text-xs text-[#717680]">
                      {customer.contactPerson} • {customer.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCustomer(index)}
                    className="text-[#717680] hover:text-red-600 hover:bg-red-50 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Add Customer
            </DialogTitle>
            <DialogDescription>
              Add a new customer to your account
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm font-medium text-black">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerName"
                placeholder="e.g. Greenfield Construction"
                value={formData.customerName}
                onChange={handleChange('customerName')}
                className={errors.customerName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.customerName && (
                <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-sm font-medium text-black">
                Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPerson"
                placeholder="e.g. John Doe"
                value={formData.contactPerson}
                onChange={handleChange('contactPerson')}
                className={errors.contactPerson ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.contactPerson && (
                <p className="text-xs text-red-600 mt-1">{errors.contactPerson}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. billing@greenfield.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-black">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="phone"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  className={`pl-10 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress" className="text-sm font-medium text-black">Billing Address</Label>
              <Textarea
                id="billingAddress"
                placeholder="Add billing address"
                value={formData.billingAddress}
                onChange={handleChange('billingAddress')}
                rows={3}
                className="min-h-[80px] resize-none border-gray-200 bg-gray-50 focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-8 w-full items-center">
        <Button
          onClick={handleContinue}
          size="lg"
        >
          Continue
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
