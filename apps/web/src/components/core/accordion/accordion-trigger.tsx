'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccordionTriggerProps } from './types';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, hideIcon = false, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-left text-sm font-medium outline-none transition-all',
        'text-titanium hover:text-white hover:underline',
        'rounded-sm focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-tulpar-blue/50',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      {!hideIcon && (
        <ChevronDown className="pointer-events-none size-4 shrink-0 text-ash transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';
