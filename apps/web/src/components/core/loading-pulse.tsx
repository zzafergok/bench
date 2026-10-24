'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LoadingSpinnerProps } from './spinner';

const pulseSizeMap: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
  '2xl': 'h-24 w-24',
};

const pulseColorMap: Record<
  NonNullable<LoadingSpinnerProps['variant']>,
  string
> = {
  default:
    'bg-gradient-to-br from-tulpar-blue/40 via-tulpar-blue/60 to-tulpar-blue/80',
  secondary:
    'bg-gradient-to-br from-gunmetal/40 via-gunmetal/60 to-gunmetal/80',
  white: 'bg-gradient-to-br from-white via-titanium/80 to-titanium',
};

const pulseHighlightSizeMap: Record<
  NonNullable<LoadingSpinnerProps['size']>,
  string
> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
  xl: 'h-5 w-5',
  '2xl': 'h-6 w-6',
};

export const LoadingPulse = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(({ className, size = 'md', variant = 'default', text, ...props }, ref) => {
  const s = size ?? 'md';
  const v = variant ?? 'default';
  return (
    <div
      ref={ref}
      data-slot="loading-pulse"
      className={cn('inline-flex items-center gap-3', className)}
      {...props}
    >
      <div className="relative">
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-30 blur-sm',
            pulseSizeMap[s],
            pulseColorMap[v],
          )}
          style={{
            animation: 'modernPulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
          }}
        />
        <div
          className={cn(
            'relative rounded-full shadow-lg',
            pulseSizeMap[s],
            pulseColorMap[v],
          )}
          style={{
            animation: 'modernPulse 2s cubic-bezier(0.4,0,0.6,1) infinite 0.3s',
            boxShadow:
              'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.1)',
          }}
        />
        <div
          className={cn(
            'absolute left-1/4 top-1/4 rounded-full bg-white opacity-40',
            pulseHighlightSizeMap[s],
          )}
          style={{
            animation: 'modernPulse 2s cubic-bezier(0.4,0,0.6,1) infinite 0.1s',
          }}
        />
      </div>
      {text && <span className="text-sm text-ash/70">{text}</span>}
    </div>
  );
});
LoadingPulse.displayName = 'LoadingPulse';
