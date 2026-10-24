'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-mono text-sm font-medium transition-colors select-none cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-tulpar-blue/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-alert-red aria-invalid:ring-1 aria-invalid:ring-alert-red/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-transparent text-ash hover:bg-gunmetal/30 hover:text-white data-[state=on]:bg-gunmetal/60 data-[state=on]:text-white',
        outline:
          'border border-gunmetal/80 bg-transparent text-ash shadow-xs hover:bg-gunmetal/30 hover:text-white data-[state=on]:border-gunmetal data-[state=on]:bg-gunmetal/60 data-[state=on]:text-white',
      },
      size: {
        default: 'h-9 min-w-9 px-2.5 text-sm',
        sm: 'h-8 min-w-8 px-2 text-xs',
        lg: 'h-10 min-w-10 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    data-slot="toggle"
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;
