'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  RefreshCw, 
  Info, 
  X,
  Wand2,
  Clock,
  Database,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface DemoModeBannerProps {
  onGenerateData?: () => void;
  onResetData?: () => void;
  onStartTour?: () => void;
}

export default function DemoModeBanner({ 
  onGenerateData, 
  onResetData,
  onStartTour,
}: DemoModeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200 hover:bg-yellow-100 transition-all animate-in slide-in-from-right duration-300"
      >
        <Sparkles className="w-3 h-3 inline mr-1" />
        Demo Mode
      </button>
    );
  }

  const handleGenerateData = async () => {
    setIsGenerating(true);
    
    // Generate random applications
    const newApplications = Array.from({ length: 5 }, (_, i) => ({
      id: `APP-DEMO-${Date.now()}-${i}`,
      businessName: `Demo Business ${Math.floor(Math.random() * 1000)}`,
      businessType: ['LLC', 'Corporation', 'Sole Proprietor'][Math.floor(Math.random() * 3)],
      industry: ['Technology', 'Healthcare', 'Retail', 'Construction'][Math.floor(Math.random() * 4)],
      ein: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`,
      email: `demo${Math.floor(Math.random() * 1000)}@example.com`,
      address: {
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston'][Math.floor(Math.random() * 4)],
        state: ['NY', 'CA', 'IL', 'TX'][Math.floor(Math.random() * 4)],
      },
      customersCount: Math.floor(Math.random() * 50) + 1,
      bankConnected: Math.random() > 0.3,
      bankName: ['Chase', 'Bank of America', 'Wells Fargo'][Math.floor(Math.random() * 3)],
      invoicesCount: Math.floor(Math.random() * 20) + 1,
      totalInvoiceAmount: Math.floor(Math.random() * 500000) + 10000,
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      status: ['pending', 'under_review', 'approved', 'rejected'][Math.floor(Math.random() * 4)] as any,
      riskScore: Math.floor(Math.random() * 40) + 60,
      documentsVerified: Math.random() > 0.2,
    }));
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('demoApplications') || '[]');
    const updated = [...existing, ...newApplications];
    localStorage.setItem('demoApplications', JSON.stringify(updated));
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    toast.success(`Generated ${newApplications.length} new applications!`, {
      description: 'Refresh the page to see them in the dashboard',
      action: {
        label: 'Refresh Now',
        onClick: () => window.location.reload(),
      },
    });
    
    onGenerateData?.();
  };

  const handleResetData = () => {
    localStorage.clear();
    toast.success('Demo data has been reset', {
      description: 'Refreshing page to apply changes...',
    });
    setTimeout(() => window.location.reload(), 1000);
    onResetData?.();
  };

  const scenarios = [
    { name: 'High Risk Applications', icon: '⚠️', action: () => generateScenario('high-risk') },
    { name: 'Approved Applications', icon: '✅', action: () => generateScenario('approved') },
    { name: 'Mixed Portfolio', icon: '📊', action: () => generateScenario('mixed') },
    { name: 'New Applications Rush', icon: '🚀', action: () => generateScenario('rush') },
  ];

  const generateScenario = (type: string) => {
    toast.info(`Loading "${type}" scenario...`);
    // Generate specific scenario data
    handleGenerateData();
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-b border-yellow-200 px-4 py-2 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-4 h-4 text-yellow-600 opacity-75" />
              </div>
            </div>
            <span className="text-sm font-medium text-yellow-800">
              Demo Mode Active
            </span>
          </div>
          
          <span className="text-xs text-yellow-600 hidden sm:inline">
            Sample data • Not connected to real backend • Resets every 24h
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-yellow-700 hover:bg-yellow-100"
            onClick={handleGenerateData}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3 mr-1" />
                Generate Data
              </>
            )}
          </Button>

          {/* Scenarios Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-yellow-700 hover:bg-yellow-100"
              >
                <Database className="w-3 h-3 mr-1" />
                Scenarios
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-gray-700">Load Demo Scenario</p>
              </div>
              <DropdownMenuSeparator />
              {scenarios.map((scenario) => (
                <DropdownMenuItem key={scenario.name} onClick={scenario.action}>
                  <span className="mr-2">{scenario.icon}</span>
                  {scenario.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleResetData} className="text-red-600">
                <RefreshCw className="w-3 h-3 mr-2" />
                Reset All Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tour Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-yellow-700 hover:bg-yellow-100"
            onClick={onStartTour}
          >
            <Info className="w-3 h-3 mr-1" />
            Tour
          </Button>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Demo Timer */}
      <div className="absolute right-4 -bottom-6 bg-white border border-yellow-200 rounded-full px-2 py-0.5 text-xs text-yellow-700 flex items-center gap-1 animate-in slide-in-from-right duration-700 delay-300">
        <Clock className="w-3 h-3" />
        <span>Resets in 23h 45m</span>
      </div>
    </div>
  );
}
