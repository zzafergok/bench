'use client';

import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/core/toggle';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
  }
>({
  size: 'default',
  variant: 'default',
  spacing: 2,
});

const spacingClasses: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
};

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
      spacing?: number;
    }
>(
  (
    {
      className,
      variant,
      size,
      spacing = 2,
      children,
      orientation = 'horizontal',
      ...props
    },
    ref,
  ) => {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        data-spacing={spacing}
        data-orientation={orientation}
        orientation={orientation}
        className={cn(
          'group/toggle-group flex w-fit items-center rounded-sm data-[orientation=vertical]:flex-col',
          spacing === 0 &&
            '[&>[data-slot=toggle-group-item]:focus-visible]:z-10 data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:-ml-px data-[orientation=vertical]:[&>[data-slot=toggle-group-item]:not(:first-child)]:-mt-px data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:rounded-l-none data-[orientation=vertical]:[&>[data-slot=toggle-group-item]:not(:first-child)]:rounded-t-none rtl:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:-mr-px rtl:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:ml-0 rtl:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:rounded-l-sm rtl:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:rounded-r-none data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-r-none data-[orientation=vertical]:[&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-b-none rtl:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-l-none rtl:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-r-sm',
          spacingClasses[spacing] ?? 'gap-2',
          className,
        )}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  },
);
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  const itemVariant = variant ?? context.variant;
  const itemSize = size ?? context.size;

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      data-variant={itemVariant}
      data-size={itemSize}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: itemVariant,
          size: itemSize,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
