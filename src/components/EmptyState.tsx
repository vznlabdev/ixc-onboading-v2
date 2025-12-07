import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in-50 duration-500',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-500 delay-100">
          <div className="text-gray-400">{icon}</div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6 animate-in slide-in-from-bottom-2 duration-500 delay-300">
          {description}
        </p>
      )}
      
      {action && (
        <div className="animate-in slide-in-from-bottom-2 duration-500 delay-400">
          {action}
        </div>
      )}
    </div>
  );
}
