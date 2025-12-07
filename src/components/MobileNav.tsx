'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  X,
  Home,
  FileText,
  BarChart,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Applications',
    href: '/admin/dashboard',
    icon: <FileText className="w-5 h-5" />,
    badge: 8,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Audit Log',
    href: '/admin/audit',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

interface MobileNavProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onSignOut?: () => void;
}

export default function MobileNav({ user, onSignOut }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle className="flex items-center justify-between">
            <span>Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigate(item.href)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        isActive
                          ? 'bg-white text-black'
                          : 'bg-red-100 text-red-600'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Responsive Table Component
export function ResponsiveTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <>
      {/* Desktop Table */}
      <div className={cn('hidden lg:block', className)}>
        <table className="w-full">{children}</table>
      </div>
      
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {/* Convert table rows to cards for mobile */}
        {children}
      </div>
    </>
  );
}

// Mobile Card for Table Row
export function MobileTableCard({ 
  data,
  onAction,
}: {
  data: Record<string, any>;
  onAction?: (action: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 animate-fade-in">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between items-start">
          <span className="text-xs font-medium text-gray-500 uppercase">{key}</span>
          <span className="text-sm text-gray-900 text-right">{value}</span>
        </div>
      ))}
      
      {onAction && (
        <div className="pt-3 border-t border-gray-200 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onAction('view')}
          >
            View
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onAction('action')}
          >
            Action
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
