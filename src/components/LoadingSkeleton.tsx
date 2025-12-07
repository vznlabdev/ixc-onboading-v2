import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({ 
  className, 
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'circular' ? 40 : '100%'),
    height: height || (variant === 'circular' ? 40 : variant === 'card' ? 200 : 16),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(baseClasses, variantClasses[variant], className)}
          style={style}
        />
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full animate-in fade-in-50 duration-500">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <Skeleton width="20%" height={20} />
            <Skeleton width="30%" height={20} />
            <Skeleton width="15%" height={20} />
            <Skeleton width="15%" height={20} />
            <Skeleton width="20%" height={20} />
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex gap-4 items-center">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 flex gap-4">
                <Skeleton width="15%" />
                <Skeleton width="25%" />
                <Skeleton width="10%" />
                <Skeleton width="15%" />
                <Skeleton width="20%" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-6 animate-in fade-in-50 duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton width={60} height={20} />
          </div>
          <Skeleton width="40%" height={24} className="mb-2" />
          <Skeleton width="60%" height={16} />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between mb-6">
        <Skeleton width={150} height={24} />
        <Skeleton width={100} height={32} />
      </div>
      <div className="h-64 flex items-end justify-between gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={`${Math.random() * 60 + 40}%`}
              className="mb-2"
            />
            <Skeleton width="100%" height={12} />
          </div>
        ))}
      </div>
    </div>
  );
}
