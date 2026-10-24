'use client';

import * as React from 'react';
import { LoaderIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── Inline Spinner (lucide, button/inline kullanımı) ─────────────────────────

export function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

// ─── LoadingSpinner (CVA, standalone/page-level, SVG halka) ───────────────────

const spinnerVariants = cva('', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
      '2xl': 'h-16 w-16',
    },
    variant: {
      default: 'text-tulpar-blue',
      secondary: 'text-ash',
      white: 'text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface LoadingSpinnerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string;
  centered?: boolean;
}

export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(({ className, size, variant, text, centered = false, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="loading-spinner"
    className={cn(
      'inline-flex items-center gap-3',
      centered && 'w-full justify-center',
      className,
    )}
    {...props}
  >
    <div className={cn('relative', spinnerVariants({ size, variant }))}>
      {/* Glow ring */}
      <div className="absolute inset-0 animate-spin rounded-full bg-linear-to-r from-current via-transparent to-current opacity-20" />
      {/* SVG arc */}
      <svg
        className="relative animate-spin"
        style={{
          animationDuration: '1.5s',
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
        }}
        viewBox="0 0 24 24"
        fill="none"
        role="status"
        aria-label={text ?? 'Loading'}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="opacity-25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="23.562"
          className="opacity-75"
          style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
        />
      </svg>
    </div>
    {text && <span className="animate-pulse text-sm text-ash/70">{text}</span>}
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// ─── LoadingDots (bouncing dots) ──────────────────────────────────────────────

const dotSizeMap: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  xs: 'h-1 w-1',
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
  xl: 'h-3 w-3',
  '2xl': 'h-4 w-4',
};

const dotColorMap: Record<
  NonNullable<LoadingSpinnerProps['variant']>,
  string
> = {
  default: 'bg-tulpar-blue',
  secondary: 'bg-gunmetal',
  white: 'bg-white shadow-lg',
};

export const LoadingDots = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(({ className, size = 'md', variant = 'default', text, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="loading-dots"
    className={cn('inline-flex items-center gap-3', className)}
    {...props}
  >
    <div className="flex space-x-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'transform-gpu rounded-full drop-shadow-sm',
            dotSizeMap[size ?? 'md'],
            dotColorMap[variant ?? 'default'],
          )}
          style={{
            animation: `modernBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
    {text && <span className="text-sm text-ash/70">{text}</span>}
  </div>
));
LoadingDots.displayName = 'LoadingDots';

// ─── LoadingPulse (pulsing blob) ──────────────────────────────────────────────

export { LoadingPulse } from './loading-pulse';
