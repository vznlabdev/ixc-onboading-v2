'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Link as LinkIcon, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface BankConnectStepProps {
  onNext: () => void;
  onSkip: () => void;
  initialBank?: {
    bankId: string;
    bankName: string;
    isManual: boolean;
  };
  onSave?: (bank: { bankId: string; bankName: string; isManual: boolean }) => void;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  provider: string;
}

const banks: Bank[] = [
  { id: 'plaid', name: 'Plaid', logo: '/banks/plaid.svg', provider: 'Plaid' },
  { id: 'chase', name: 'Chase', logo: '/banks/chase.svg', provider: 'Chase' },
  { id: 'wells-fargo', name: 'Wells Fargo', logo: '/banks/wells-fargo.svg', provider: 'Wells Fargo' },
  { id: 'bank-of-america', name: 'Bank of America', logo: '/banks/bank-of-america.svg', provider: 'Bank of America' },
];

export default function BankConnectStep({
  onNext,
  onSkip,
  initialBank,
  onSave,
}: BankConnectStepProps) {
  const [selectedBank, setSelectedBank] = useState<string>(initialBank?.bankId || 'plaid');
  const [showConnecting, setShowConnecting] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [manualFormData, setManualFormData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: '',
  });

  console.log('BankConnectStep - initialBank:', initialBank);
  console.log('BankConnectStep - onSave callback exists:', !!onSave);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handleConnectManually = () => {
    setShowManualForm(true);
  };

  const handleBackToSelection = () => {
    setShowManualForm(false);
    setManualFormData({
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: '',
    });
  };

  const handleManualFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualFormData({
      ...manualFormData,
      [field]: event.target.value,
    });
  };

  const handleConnect = () => {
    setShowConnecting(true);
    setConnectionStatus('connecting');
    
    const bank = banks.find(b => b.id === selectedBank);
    
    // Simulate bank connection with random success/failure
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        setConnectionStatus('success');
        // Save bank data
        console.log('BankConnectStep - Saving automated bank connection:', bank);
        if (onSave && bank) {
          onSave({
            bankId: bank.id,
            bankName: bank.name,
            isManual: false,
          });
          console.log('BankConnectStep - Bank data saved successfully');
        } else {
          console.warn('BankConnectStep - onSave callback not available!');
        }
        setTimeout(() => {
          onNext();
        }, 2000);
      } else {
        setConnectionStatus('error');
        setErrorMessage('Unable to connect to your bank. Please try again or connect manually.');
        setTimeout(() => {
          setShowConnecting(false);
          setConnectionStatus('idle');
        }, 3000);
      }
    }, 2500);
  };

  const handleManualConnect = () => {
    if (manualFormData.bankName && manualFormData.accountNumber && manualFormData.routingNumber) {
      setShowConnecting(true);
      setConnectionStatus('connecting');
      
      // Simulate manual bank connection
      setTimeout(() => {
        const isSuccess = Math.random() > 0.15; // 85% success rate
        
        if (isSuccess) {
          setConnectionStatus('success');
          // Save manual bank data
          console.log('BankConnectStep - Saving manual bank connection:', manualFormData);
          if (onSave) {
            onSave({
              bankId: 'manual',
              bankName: manualFormData.bankName,
              isManual: true,
            });
            console.log('BankConnectStep - Manual bank data saved successfully');
          } else {
            console.warn('BankConnectStep - onSave callback not available!');
          }
          setTimeout(() => {
            onNext();
          }, 2000);
        } else {
          setConnectionStatus('error');
          setErrorMessage('Invalid account details. Please check and try again.');
          setTimeout(() => {
            setShowConnecting(false);
            setConnectionStatus('idle');
          }, 3000);
        }
      }, 2500);
    }
  };

  if (showManualForm) {
    return (
      <div className="flex flex-col items-center min-h-full px-8 py-12 max-w-[600px] mx-auto">
        {/* Back Button */}
        <div className="w-full mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSelection}
            className="text-[#535862] hover:bg-[#F5F5F5] p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-[#181D27] mb-4 text-center">
          Connect manually
        </h1>

        {/* Description */}
        <p className="text-base font-normal text-[#535862] mb-8 text-center max-w-[500px]">
          Enter your bank account details to connect manually.
        </p>

        {/* Manual Form */}
        <div className="w-full flex flex-col gap-6">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">
              Bank Name <span className="text-red-500">*</span>
            </Label>
            <Select
              value={manualFormData.bankName}
              onValueChange={(value) => setManualFormData({ ...manualFormData, bankName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chase">Chase</SelectItem>
                <SelectItem value="bank-of-america">Bank of America</SelectItem>
                <SelectItem value="wells-fargo">Wells Fargo</SelectItem>
                <SelectItem value="citibank">Citibank</SelectItem>
                <SelectItem value="us-bank">U.S. Bank</SelectItem>
                <SelectItem value="pnc">PNC Bank</SelectItem>
                <SelectItem value="capital-one">Capital One</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="accountType">
              Account Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={manualFormData.accountType}
              onValueChange={(value) => setManualFormData({ ...manualFormData, accountType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="business-checking">Business Checking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">
              Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="accountNumber"
              placeholder="Enter your account number"
              value={manualFormData.accountNumber}
              onChange={handleManualFormChange('accountNumber')}
            />
          </div>

          {/* Routing Number */}
          <div className="space-y-2">
            <Label htmlFor="routingNumber">
              Routing Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="routingNumber"
              placeholder="Enter routing number"
              value={manualFormData.routingNumber}
              onChange={handleManualFormChange('routingNumber')}
            />
            <p className="text-xs text-[#717680]">
              9-digit routing number found on your checks
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-12 w-full items-center">
          <Button
            onClick={handleManualConnect}
            disabled={!manualFormData.bankName || !manualFormData.accountNumber || !manualFormData.routingNumber || !manualFormData.accountType}
            className="px-8 py-2 text-sm font-medium rounded-lg min-w-[150px]"
          >
            Connect
          </Button>
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-sm text-[#535862] hover:bg-transparent hover:underline"
          >
            Skip for now
          </Button>
        </div>

        {/* Security Note */}
        <p className="text-xs font-normal text-[#717680] mt-8 text-center">
          Your credentials are encrypted and never stored by IncoXchange.
        </p>
      </div>
    );
  }

  if (showConnecting) {
    const connectedBank = banks.find(b => b.id === selectedBank);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-8 py-12 text-center">
        {/* Status Icon or Logo */}
        {connectionStatus === 'success' ? (
          <CheckCircle className="w-20 h-20 text-emerald-500 mb-8" />
        ) : connectionStatus === 'error' ? (
          <XCircle className="w-20 h-20 text-red-500 mb-8" />
        ) : connectedBank ? (
          <div className="w-[150px] h-20 relative mb-8">
            <Image
              src={connectedBank.logo}
              alt={`${connectedBank.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : null}

        {/* Title */}
        <h1 className={`text-3xl font-semibold mb-4 ${
          connectionStatus === 'error' ? 'text-red-500' : 
          connectionStatus === 'success' ? 'text-emerald-500' : 
          'text-[#181D27]'
        }`}>
          {connectionStatus === 'success' 
            ? 'Successfully connected!' 
            : connectionStatus === 'error'
            ? 'Connection failed'
            : `Connecting to ${connectedBank?.provider}`}
        </h1>

        {/* Description */}
        <p className="text-base font-normal text-[#535862] mb-8 max-w-[500px]">
          {connectionStatus === 'success'
            ? 'Your bank account has been securely linked.'
            : connectionStatus === 'error'
            ? errorMessage
            : 'Please wait while we securely connect to your bank account...'}
        </p>

        {/* Loading Spinner or Status Icon */}
        {connectionStatus === 'connecting' && (
          <div className="w-12 h-12 border-4 border-[#E9EAEB] border-t-[#2164ef] rounded-full animate-spin" />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full px-4 sm:px-8 py-8 sm:py-12 max-w-[900px] mx-auto">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4 text-center">
        Connect your bank
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base font-normal text-[#535862] mb-8 sm:mb-12 text-center max-w-[600px]">
        Securely link your business bank account to verify transactions and enable faster payments.
      </p>

      {/* Bank Options Grid */}
      <div className="w-full mb-8 max-w-[700px] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banks.map((bank) => (
          <Card
            key={bank.id}
            role="button"
            tabIndex={0}
            aria-label={`Select ${bank.name}`}
            onClick={() => handleBankSelect(bank.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBankSelect(bank.id);
              }
            }}
            className={`cursor-pointer relative transition-all ${
              selectedBank === bank.id 
                ? 'border-2 border-[#2164ef]' 
                : 'border border-[#E9EAEB] hover:border-[#A4A7AE] hover:shadow-md'
            }`}
          >
            <CardContent className="p-8 flex flex-col items-center gap-4 relative">
              {/* Checkbox */}
              {selectedBank === bank.id && (
                <Checkbox
                  checked
                  className="absolute top-2 left-2 pointer-events-none"
                />
              )}

              {/* Bank Logo */}
              <div className="w-[120px] h-[60px] relative mb-2">
                <Image
                  src={bank.logo}
                  alt={`${bank.name} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* Bank Name */}
              <p className="text-sm font-medium text-[#535862]">
                Connect with {bank.provider}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connect Manually Link */}
      <button
        onClick={handleConnectManually}
        className="flex items-center gap-2 text-sm font-medium text-[#2164ef] hover:underline mb-12 cursor-pointer"
      >
        <LinkIcon className="w-4 h-4" />
        Connect manually
      </button>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full items-center">
        <Button
          onClick={handleConnect}
          className="px-8 py-2 text-sm font-medium rounded-lg min-w-[150px]"
        >
          Connect
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-sm text-[#535862] hover:bg-transparent hover:underline"
        >
          Skip for now
        </Button>
      </div>

      {/* Security Badges */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#eff6ff] rounded">
            <Lock className="w-4 h-4 text-[#2164ef]" />
            <span className="text-xs font-medium text-[#2164ef]">
              256-bit Encryption
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#eff6ff] rounded">
            <ShieldCheck className="w-4 h-4 text-[#2164ef]" />
            <span className="text-xs font-medium text-[#2164ef]">
              Read-only Access
            </span>
          </div>
        </div>
        <p className="text-xs font-normal text-[#717680] text-center">
          Your credentials are encrypted and never stored by IncoXchange.
        </p>
      </div>
    </div>
  );
}
