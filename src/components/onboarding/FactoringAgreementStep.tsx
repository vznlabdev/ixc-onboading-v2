'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, PartyPopper } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface FactoringAgreementStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const AGREEMENT_VERSION = 'v1.0.0'; // Track version for legal purposes

export default function FactoringAgreementStep({
  onNext,
  onSkip,
}: FactoringAgreementStepProps) {
  const { factoringAgreement, saveFactoringAgreement } = useUser();
  
  // Initialize from saved data if available
  const [agreed, setAgreed] = useState(factoringAgreement?.agreed || false);
  const [signature, setSignature] = useState(factoringAgreement?.signature || '');
  const [isSigning, setIsSigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved agreement data on mount
  useEffect(() => {
    if (factoringAgreement) {
      setAgreed(factoringAgreement.agreed);
      setSignature(factoringAgreement.signature);
    }
  }, [factoringAgreement]);

  const handleSignAgreement = () => {
    if (agreed && signature.trim()) {
      setIsSigning(true);
      
      // Save the agreement data
      const agreementData = {
        agreed: true,
        signature: signature.trim(),
        signedAt: new Date(),
        agreementVersion: AGREEMENT_VERSION,
      };
      
      saveFactoringAgreement(agreementData);
      
      // Simulate signing process
      setTimeout(() => {
        setIsSigning(false);
        setShowSuccess(true);
        
        // Show success screen then complete
        setTimeout(() => {
          onNext();
        }, 3000);
      }, 1500);
    }
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-4 sm:px-8 py-8 sm:py-12 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8">
          <PartyPopper className="w-12 h-12 text-emerald-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4">
          Welcome to IncoXchange!
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base font-normal text-[#535862] mb-4 max-w-[600px]">
          Your account has been successfully set up.
        </p>

        {/* Additional Info */}
        <p className="text-sm font-normal text-[#717680] max-w-[600px]">
          We&apos;re preparing your dashboard. You&apos;ll be redirected shortly.
        </p>

        {/* Loading Indicator */}
        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#2164ef] animate-bounce"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full px-4 sm:px-8 py-8 sm:py-12 max-w-[800px] mx-auto">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4 text-center">
        Sign the factoring agreement
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base font-normal text-[#535862] mb-12 text-center max-w-[600px]">
        Review and sign the agreement to complete your onboarding and start accessing funding.
      </p>

      {/* Agreement Document */}
      <Card className="w-full border border-[#E9EAEB] rounded-lg mb-8">
        {/* Document Header */}
        <CardHeader className="p-6 bg-[#FAFAFA] border-b border-[#E9EAEB] flex flex-row items-center gap-4">
          <FileText className="text-[#2164ef] w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-[#181D27]">
              Factoring Services Agreement
            </h3>
            <p className="text-xs text-[#717680]">
              Last updated: November 13, 2025
            </p>
          </div>
        </CardHeader>

        {/* Agreement Content */}
        <CardContent className="p-8 max-h-[400px] overflow-y-auto text-sm leading-relaxed text-[#535862]">
          <h4 className="text-sm font-semibold text-[#181D27] mb-3">
            1. Services Provided
          </h4>
          <p className="text-sm mb-6">
            IncoXchange agrees to provide invoice factoring services to facilitate cash flow management
            for your business. We will purchase approved invoices at an agreed-upon discount rate and
            provide immediate funding to your designated bank account.
          </p>

          <h4 className="text-sm font-semibold text-[#181D27] mb-3">
            2. Terms and Conditions
          </h4>
          <p className="text-sm mb-6">
            The factoring fee will be calculated based on the invoice amount and payment terms.
            Standard fees range from 1-5% depending on customer creditworthiness and payment timeline.
            You will receive funding within 24 hours of invoice approval.
          </p>

          <h4 className="text-sm font-semibold text-[#181D27] mb-3">
            3. Customer Verification
          </h4>
          <p className="text-sm mb-6">
            We reserve the right to verify and approve customers before purchasing invoices.
            Customer credit checks may be performed. You warrant that all invoices submitted
            represent legitimate business transactions.
          </p>

          <h4 className="text-sm font-semibold text-[#181D27] mb-3">
            4. Payment Responsibility
          </h4>
          <p className="text-sm mb-6">
            In the event of customer non-payment after 90 days, you agree to repurchase the invoice
            at face value. We will work with you to recover outstanding payments before exercising
            this option.
          </p>

          <h4 className="text-sm font-semibold text-[#181D27] mb-3">
            5. Data Security and Privacy
          </h4>
          <p className="text-sm mb-6">
            All your business data, customer information, and banking details are encrypted using
            256-bit SSL encryption. We never sell or share your data with third parties. Your
            information is used solely for providing factoring services.
          </p>

          <h4 className="text-sm font-semibold text-[#181D27] mb-3">
            6. Termination
          </h4>
          <p className="text-sm">
            Either party may terminate this agreement with 30 days written notice. Outstanding
            invoices and obligations will remain in effect until fully settled.
          </p>
        </CardContent>
      </Card>

      {/* Agreement Checkbox */}
      <div className="w-full mb-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="agree" className="text-sm text-[#181D27] cursor-pointer">
            I have read and agree to the terms of the Factoring Services Agreement
          </Label>
        </div>
      </div>

      <Separator className="w-full mb-6" />

      {/* Signature Field */}
      <div className="w-full mb-8">
        <Label htmlFor="signature" className="text-sm font-semibold text-[#181D27] mb-3 block">
          Electronic Signature <span className="text-red-500">*</span>
        </Label>
        <Input
          id="signature"
          placeholder="Type your full name to sign"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          disabled={!agreed}
          className={`rounded-lg ${!agreed ? 'bg-[#F5F5F5]' : 'bg-white'}`}
        />
        <p className="text-xs text-[#717680] mt-2">
          By typing your name, you agree to sign this document electronically
        </p>
        {signature && (
          <div className="mt-4 p-4 bg-[#FAFAFA] rounded border-l-4 border-[#2164ef]">
            <p className="text-xl font-cursive italic text-[#181D27] mb-2">
              {signature}
            </p>
            <p className="text-xs text-[#717680]">
              Signed on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full items-center">
        <Button
          onClick={handleSignAgreement}
          disabled={!agreed || !signature.trim() || isSigning}
          aria-label="Sign agreement and complete onboarding"
          className="px-8 py-2 text-sm font-medium rounded-lg min-w-[200px]"
        >
          {isSigning ? 'Processing...' : 'Sign Agreement'}
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-sm text-[#535862] hover:bg-transparent hover:underline"
        >
          Save and finish later
        </Button>
      </div>

      {/* Legal Note */}
      <p className="text-xs font-normal text-[#717680] mt-8 text-center max-w-[600px]">
        This electronic signature has the same legal effect as a handwritten signature.
        A copy of the signed agreement will be sent to your email.
      </p>
    </div>
  );
}
