'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tulpar-blue/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>[data-icon=inline-start]]:-ml-0.5 [&>[data-icon=inline-start]]:mr-1.5 [&>[data-icon=inline-end]]:-mr-0.5 [&>[data-icon=inline-end]]:ml-1.5 rtl:[&>[data-icon=inline-start]]:-mr-0.5 rtl:[&>[data-icon=inline-start]]:ml-1.5 rtl:[&>[data-icon=inline-end]]:-ml-0.5 rtl:[&>[data-icon=inline-end]]:mr-1.5',
  {
    variants: {
      variant: {
        default:
          'bg-tulpar-blue text-accent-text font-bold shadow-xs hover:bg-accent-hover',
        destructive:
          'bg-alert-red text-white shadow-xs hover:bg-alert-red/90 focus-visible:ring-alert-red/50',
        'ghost-danger':
          'bg-transparent text-slate-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 focus-visible:ring-red-400/50',
        outline:
          'border border-gunmetal bg-transparent text-titanium hover:bg-gunmetal/20 hover:border-gunmetal',
        secondary: 'bg-gunmetal text-titanium hover:bg-gunmetal/80',
        ghost: 'text-titanium hover:bg-gunmetal/20',
        subtle:
          'text-tulpar-blue bg-transparent hover:bg-tulpar-blue/10 hover:text-tulpar-blue',
        link: 'text-tulpar-blue underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        compact: 'h-auto px-4 py-[6px] text-xs gap-2 rounded-md font-medium',
        xs: 'h-7 rounded-sm px-2 text-xs [&_svg]:size-3.5',
        sm: 'h-9 rounded-sm px-3 text-sm [&_svg]:size-4',
        lg: 'h-11 rounded-sm px-8 text-base [&_svg]:size-5',
        icon: 'size-10 [&_svg]:size-5',
        'icon-xs': 'size-7 [&_svg]:size-3.5',
        'icon-sm': 'size-9 [&_svg]:size-4',
        'icon-lg': 'size-11 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant ?? 'default'}
        data-size={size ?? 'default'}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
