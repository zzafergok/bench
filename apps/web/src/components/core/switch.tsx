'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> {
  size?: 'default' | 'sm';
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = 'default', ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    data-size={size}
    className={cn(
      'group/switch shadow-xs peer inline-flex shrink-0 cursor-pointer items-center rounded-sm border-2 border-transparent outline-none transition-all',
      'focus-visible:border-tulpar-blue/70 focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-alert-red aria-invalid:ring-1 aria-invalid:ring-alert-red/30',
      'data-[state=checked]:bg-tulpar-blue data-[state=unchecked]:bg-gunmetal/80',
      'data-[size=default]:h-5 data-[size=default]:w-9',
      'data-[size=sm]:h-4 data-[size=sm]:w-7',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        'rounded-xs pointer-events-none block bg-void-black shadow-sm transition-transform dark:bg-titanium',
        'data-[size=default]:size-4 data-[size=sm]:size-3',
        'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        'rtl:data-[state=checked]:-translate-x-4',
        'group-data-[size=sm]/switch:data-[state=checked]:translate-x-3 group-data-[size=sm]/switch:rtl:data-[state=checked]:-translate-x-3',
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
