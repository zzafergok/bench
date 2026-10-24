'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import type { AccordionRootProps } from './types';

export const AccordionRoot = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionRootProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    className={cn('w-full', className)}
    {...props}
  />
));

AccordionRoot.displayName = 'AccordionRoot';
