'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo admin user in localStorage
    const demoAdmin = {
      id: '1',
      email: 'admin@incoxchange.com',
      name: 'Sarah Anderson',
      role: 'admin',
      department: 'Operations',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah Anderson',
    };
    
    localStorage.setItem('adminUser', JSON.stringify(demoAdmin));
    
    // Redirect to dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black mx-auto mb-4" />
        <p className="text-sm text-gray-600">Setting up demo session...</p>
      </div>
    </div>
  );
}
