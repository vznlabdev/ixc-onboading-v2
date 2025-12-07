'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

const defaultSteps: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Welcome to Admin Dashboard! 👋',
    content: 'This is your command center for managing applications. Let\'s take a quick tour of the key features.',
    position: 'bottom',
  },
  {
    target: '[data-tour="stats"]',
    title: 'Real-time Statistics 📊',
    content: 'Monitor key metrics at a glance. These cards update in real-time as applications are processed.',
    position: 'bottom',
  },
  {
    target: '[data-tour="search"]',
    title: 'Powerful Search & Filters 🔍',
    content: 'Quickly find applications using search or apply filters to narrow down results.',
    position: 'bottom',
  },
  {
    target: '[data-tour="applications-table"]',
    title: 'Applications Table 📋',
    content: 'View all applications with detailed information. Click on any row for more actions.',
    position: 'top',
  },
  {
    target: '[data-tour="bulk-actions"]',
    title: 'Bulk Operations ⚡',
    content: 'Select multiple applications to approve, reject, or export them all at once.',
    position: 'bottom',
  },
  {
    target: '[data-tour="analytics"]',
    title: 'Analytics Dashboard 📈',
    content: 'Navigate to Analytics for detailed insights and trends.',
    position: 'bottom',
  },
  {
    target: '[data-tour="demo-banner"]',
    title: 'Demo Features 🎭',
    content: 'Use the demo banner to generate sample data, reset the database, or load different scenarios.',
    position: 'bottom',
  },
];

export default function GuidedTour({ 
  steps = defaultSteps, 
  isOpen, 
  onClose 
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const updateHighlight = () => {
      const step = steps[currentStep];
      if (!step?.target) return;

      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition(rect);
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    
    return () => window.removeEventListener('resize', updateHighlight);
  }, [isOpen, currentStep, steps]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onClose();
  };

  const getTooltipPosition = () => {
    if (!highlightPosition || !step) return {};

    const padding = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let top = 'auto';
    let bottom = 'auto';
    let left = 'auto';
    let right = 'auto';

    switch (step.position) {
      case 'top':
        bottom = window.innerHeight - highlightPosition.top + padding + 'px';
        left = highlightPosition.left + highlightPosition.width / 2 - tooltipWidth / 2 + 'px';
        break;
      case 'bottom':
        top = highlightPosition.bottom + padding + 'px';
        left = highlightPosition.left + highlightPosition.width / 2 - tooltipWidth / 2 + 'px';
        break;
      case 'left':
        top = highlightPosition.top + highlightPosition.height / 2 - tooltipHeight / 2 + 'px';
        right = window.innerWidth - highlightPosition.left + padding + 'px';
        break;
      case 'right':
        top = highlightPosition.top + highlightPosition.height / 2 - tooltipHeight / 2 + 'px';
        left = highlightPosition.right + padding + 'px';
        break;
      default:
        top = highlightPosition.bottom + padding + 'px';
        left = Math.min(
          Math.max(padding, highlightPosition.left),
          window.innerWidth - tooltipWidth - padding
        ) + 'px';
    }

    return { top, bottom, left, right };
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto animate-fade-in" onClick={handleSkip} />
      
      {/* Highlight Box */}
      {highlightPosition && (
        <div
          className="absolute border-2 border-yellow-400 rounded-lg pointer-events-none animate-pulse"
          style={{
            top: highlightPosition.top - 4,
            left: highlightPosition.left - 4,
            width: highlightPosition.width + 8,
            height: highlightPosition.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        className="absolute w-80 p-6 bg-white border-2 border-yellow-400 shadow-2xl pointer-events-auto animate-scale-in"
        style={getTooltipPosition()}
      >
        {/* Progress Indicator */}
        <div className="flex gap-1 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-300',
                index === currentStep
                  ? 'bg-yellow-500'
                  : index < currentStep
                  ? 'bg-yellow-300'
                  : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
          </div>
          <p className="text-sm text-gray-600">{step.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tour
          </button>
          
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {currentStep + 1}/{steps.length}
        </div>
      </Card>
    </div>
  );
}

// Hook to manage tour state
export function useGuidedTour() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTour');
    if (seen) {
      setHasSeenTour(true);
    } else {
      // Auto-start tour for first-time users
      setTimeout(() => setIsTourOpen(true), 1000);
    }
  }, []);

  const startTour = () => setIsTourOpen(true);
  
  const endTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem('hasSeenTour', 'true');
  };

  return { isTourOpen, startTour, endTour, hasSeenTour };
}
