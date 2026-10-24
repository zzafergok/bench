'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/core/button';

export function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        'shadow-xs flex min-h-9 flex-wrap items-center gap-1.5 rounded-sm border border-gunmetal/80 bg-obsidian bg-clip-padding px-2.5 py-1.5 text-sm transition-[color,box-shadow]',
        'focus-within:border-tulpar-blue focus-within:ring-[3px] focus-within:ring-tulpar-blue/20',
        'has-aria-invalid:border-alert-red has-aria-invalid:ring-[3px] has-aria-invalid:ring-alert-red/20',
        'has-data-[slot=combobox-chip]:px-1.5',
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        'rounded-xs flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 whitespace-nowrap bg-gunmetal/50 px-1.5 text-xs font-medium text-titanium',
        'has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0',
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="-ml-1 text-ash opacity-70 hover:text-white hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

export function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        'min-w-16 flex-1 text-titanium outline-none placeholder:text-ash/60',
        className,
      )}
      {...props}
    />
  );
}
