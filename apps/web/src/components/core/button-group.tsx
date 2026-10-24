'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonGroupVariants = cva(
  'inline-flex items-stretch rounded-sm has-[>[data-slot=button-group]]:gap-2',
  {
    variants: {
      orientation: {
        horizontal:
          'flex-row [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px rtl:[&>*:not(:first-child)]:rounded-r-none rtl:[&>*:not(:first-child)]:rounded-l-sm rtl:[&>*:not(:last-child)]:rounded-l-none rtl:[&>*:not(:last-child)]:rounded-r-sm rtl:[&>*:not(:first-child)]:-mr-px rtl:[&>*:not(:first-child)]:ml-0 [&>*:focus-visible]:z-10',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px [&>*:focus-visible]:z-10',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

export interface ButtonGroupProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  ),
);
ButtonGroup.displayName = 'ButtonGroup';

export interface ButtonGroupSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  ButtonGroupSeparatorProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    data-slot="button-group-separator"
    data-orientation={orientation}
    className={cn(
      'shrink-0 bg-gunmetal/40',
      orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
      className,
    )}
    {...props}
  />
));
ButtonGroupSeparator.displayName = 'ButtonGroupSeparator';

export interface ButtonGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const ButtonGroupText = React.forwardRef<
  HTMLDivElement,
  ButtonGroupTextProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot="button-group-text"
      className={cn(
        'inline-flex select-none items-center border border-gunmetal/40 bg-obsidian/60 px-3 text-sm font-medium text-ash',
        className,
      )}
      {...props}
    />
  );
});
ButtonGroupText.displayName = 'ButtonGroupText';
