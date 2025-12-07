'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

export default function DebugPanel() {
  const { onboardingData, isAuthenticated, userEmail } = useUser();
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!showDebug ? (
        <Button
          size="sm"
          onClick={() => setShowDebug(true)}
          className="bg-red-500 hover:bg-red-600"
        >
          Debug
        </Button>
      ) : (
        <Card className="p-4 max-w-[400px] max-h-[500px] overflow-auto bg-black/90 text-white border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold">Debug Panel</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDebug(false)}
              className="text-white hover:bg-white/10 h-auto p-0 min-w-0"
            >
              ✕
            </Button>
          </div>

          <div className="text-xs font-mono">
            <p className="text-yellow-400 mb-2 font-semibold">
              Authentication:
            </p>
            <p className="text-neutral-400 mb-4">
              Authenticated: {isAuthenticated ? 'Yes' : 'No'}
              <br />
              Email: {userEmail || 'None'}
            </p>

            <p className="text-yellow-400 mb-2 font-semibold">
              Onboarding Data:
            </p>
            <pre className="text-neutral-400 text-[0.65rem] whitespace-pre-wrap break-all">
              {JSON.stringify(onboardingData, null, 2)}
            </pre>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 text-white border-white hover:border-yellow-400 hover:bg-yellow-400/10"
              onClick={() => {
                console.log('=== DEBUG INFO ===');
                console.log('localStorage contents:', {
                  isAuthenticated: localStorage.getItem('isAuthenticated'),
                  userEmail: localStorage.getItem('userEmail'),
                  onboardingData: localStorage.getItem('onboardingData'),
                  applicationStatus: localStorage.getItem('applicationStatus'),
                });
                console.log('Context state:', {
                  isAuthenticated,
                  userEmail,
                  onboardingData,
                });
              }}
            >
              Log to Console
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-red-500 border-red-500 hover:border-red-600 hover:bg-red-500/10"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Clear All Data
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

