'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.ComponentProps<'textarea'> & {
  error?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          'shadow-xs flex min-h-16 w-full rounded-sm border border-gunmetal/80 bg-void-black px-3 py-2 font-mono text-base text-titanium outline-none transition-colors md:text-sm',
          'placeholder:text-ash/50 focus-visible:border-tulpar-blue/70 focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
          'aria-invalid:border-alert-red aria-invalid:ring-1 aria-invalid:ring-alert-red/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-alert-red ring-1 ring-alert-red/30',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
