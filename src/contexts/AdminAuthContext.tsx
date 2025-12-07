'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'viewer';
  avatar?: string;
  department?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

// Mock admin users
const MOCK_ADMIN_USERS = [
  {
    id: '1',
    email: 'admin@incoxchange.com',
    password: 'admin123',
    name: 'Sarah Anderson',
    role: 'admin' as const,
    department: 'Operations',
  },
  {
    id: '2',
    email: 'reviewer@incoxchange.com',
    password: 'reviewer123',
    name: 'James Wilson',
    role: 'reviewer' as const,
    department: 'Risk Management',
  },
];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin session
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_ADMIN_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const adminData: AdminUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
      };
      
      setAdminUser(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signOut = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
