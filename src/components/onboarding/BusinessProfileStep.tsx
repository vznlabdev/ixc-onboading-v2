'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BusinessData {
  businessName: string;
  businessType: string;
  industry: string;
  ein: string;
  state: string;
  city: string;
  street: string;
  building: string;
  zip: string;
}

interface BusinessProfileStepProps {
  onNext: () => void;
  onSkip: () => void;
  initialData?: BusinessData;
  onSave?: (data: BusinessData) => void;
}

export default function BusinessProfileStep({
  onNext,
  onSkip,
  initialData,
  onSave,
}: BusinessProfileStepProps) {
  const [formData, setFormData] = useState(initialData || {
    businessName: '',
    businessType: '',
    industry: '',
    ein: '',
    state: '',
    city: '',
    street: '',
    building: '',
    zip: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string) => (event: { target: { value: string } }) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error when user selects
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.ein.trim()) {
      newErrors.ein = 'EIN is required';
    } else if (!/^\d{2}-?\d{7}$/.test(formData.ein)) {
      newErrors.ein = 'Invalid EIN format (e.g., 12-3456789)';
    }
    
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    console.log('BusinessProfileStep - Current form data:', formData);
    if (validateForm()) {
      setIsSaving(true);
      console.log('BusinessProfileStep - Validation passed, saving form data:', formData);
      // Save data
      if (onSave) {
        onSave(formData);
      } else {
        console.warn('BusinessProfileStep - onSave callback is not provided!');
      }
      // Simulate saving
      setTimeout(() => {
        setIsSaving(false);
        onNext();
      }, 800);
    } else {
      console.log('BusinessProfileStep - Validation failed, not proceeding');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-full px-6 py-12 max-w-[520px] mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-black mb-3 text-center tracking-tight">
        Tell us about your business
      </h1>

      {/* Description */}
      <p className="text-base text-gray-600 mb-2 text-center max-w-[450px]">
        We&apos;ll use this information to verify your account details and tailor your dashboard experience.
      </p>

      {/* Additional Info */}
      <p className="text-sm text-gray-500 mb-10 text-center max-w-[450px]">
        Enter your core business details below. You can update this information anytime in your profile settings.
      </p>

      {/* Form */}
      <div className="w-full flex flex-col gap-5">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium text-black">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="e.g. IncoXchange Ltd."
            value={formData.businessName}
            onChange={handleChange('businessName')}
            className={errors.businessName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
          {errors.businessName && (
            <p className="text-xs text-red-600 mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Business Type */}
        <div className="space-y-2">
          <Label htmlFor="businessType" className="text-sm font-medium text-black">
            Business Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.businessType}
            onValueChange={handleSelectChange('businessType')}
          >
            <SelectTrigger className={errors.businessType ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
            </SelectContent>
          </Select>
          {errors.businessType && (
            <p className="text-xs text-red-600 mt-1">{errors.businessType}</p>
          )}
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-black">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.industry}
            onValueChange={handleSelectChange('industry')}
          >
            <SelectTrigger className={errors.industry ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}>
              <SelectValue placeholder="Select industry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="property_management">Property Management</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-xs text-red-600 mt-1">{errors.industry}</p>
          )}
        </div>

        {/* EIN */}
        <div className="space-y-2">
          <Label htmlFor="ein" className="text-sm font-medium text-black">
            EIN <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ein"
            placeholder="12-3456789"
            value={formData.ein}
            onChange={handleChange('ein')}
            className={errors.ein ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
          {errors.ein ? (
            <p className="text-xs text-red-600 mt-1">{errors.ein}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Employer Identification Number (e.g., 12-3456789)
            </p>
          )}
        </div>

        {/* Business Address Section */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-black mb-4">
            Business Address <span className="text-red-500">*</span>
          </p>
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium text-black">
            State <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.state}
            onValueChange={handleSelectChange('state')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
              <SelectItem value="fl">Florida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-black">
            City <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.city}
            onValueChange={handleSelectChange('city')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nyc">New York City</SelectItem>
              <SelectItem value="la">Los Angeles</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Street */}
        <div className="space-y-2">
          <Label htmlFor="street" className="text-sm font-medium text-black">Street</Label>
          <Input
            id="street"
            placeholder="123 Main St"
            value={formData.street}
            onChange={handleChange('street')}
          />
        </div>

        {/* Building */}
        <div className="space-y-2">
          <Label htmlFor="building" className="text-sm font-medium text-black">Building</Label>
          <Input
            id="building"
            placeholder="Suite 100"
            value={formData.building}
            onChange={handleChange('building')}
          />
        </div>

        {/* ZIP */}
        <div className="space-y-2">
          <Label htmlFor="zip" className="text-sm font-medium text-black">ZIP</Label>
          <Input
            id="zip"
            placeholder="10001"
            value={formData.zip}
            onChange={handleChange('zip')}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-10 w-full items-center">
        <Button
          onClick={handleContinue}
          disabled={isSaving}
          aria-label="Continue to next step"
          size="lg"
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
        >
          Skip for now
        </Button>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 mt-8 text-center">
        IncoXchange currently serves U.S.-based businesses only.
      </p>
    </div>
  );
}
