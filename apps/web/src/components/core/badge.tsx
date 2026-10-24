'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-sm border font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-tulpar-blue/50 select-none [&_svg]:pointer-events-none [&_svg]:size-3 shrink-0 [&>[data-icon=inline-start]]:-ml-0.5 [&>[data-icon=inline-start]]:mr-1.5 [&>[data-icon=inline-end]]:-mr-0.5 [&>[data-icon=inline-end]]:ml-1.5 rtl:[&>[data-icon=inline-start]]:-mr-0.5 rtl:[&>[data-icon=inline-start]]:ml-1.5 rtl:[&>[data-icon=inline-end]]:-ml-0.5 rtl:[&>[data-icon=inline-end]]:mr-1.5',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-tulpar-blue text-accent-text font-bold shadow hover:bg-accent-hover',
        secondary:
          'border-transparent bg-gunmetal text-titanium hover:bg-gunmetal/80',
        destructive:
          'border-transparent bg-alert-red text-white shadow hover:bg-alert-red/90',
        outline:
          'border-gunmetal/40 bg-transparent text-titanium hover:bg-gunmetal/20',
        ghost:
          'border-transparent bg-transparent text-titanium hover:bg-gunmetal/20',
        link: 'border-transparent text-tulpar-blue underline-offset-4 hover:underline p-0 h-auto',
        warning:
          'border-transparent bg-warning text-white shadow hover:bg-warning/90',
        none: 'border-transparent bg-transparent',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[11px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      textColor,
      borderColor,
      backgroundColor,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'span';

    const customStyle: React.CSSProperties = {
      ...(backgroundColor && { backgroundColor }),
      ...(textColor && { color: textColor }),
      ...(borderColor && {
        borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
      }),
      ...style,
    };

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size }), className)}
        style={customStyle}
        {...props}
      />
    );
  },
);
Badge.displayName = 'Badge';
