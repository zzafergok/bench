'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.ComponentProps<'input'> & {
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          'shadow-xs flex h-9 w-full min-w-0 rounded-sm border border-gunmetal/80 bg-void-black px-3 py-1 font-mono text-base text-titanium outline-none transition-colors md:text-sm',
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-titanium',
          'placeholder:text-ash/50 focus-visible:border-tulpar-blue/70 focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
          'aria-invalid:border-alert-red aria-invalid:ring-1 aria-invalid:ring-alert-red/30',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-alert-red ring-1 ring-alert-red/30',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
