'use client';

import * as React from 'react';
import { CheckIcon, CircleIcon } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'rounded-xs relative flex cursor-pointer select-none items-center gap-2 px-2 py-1.5 text-sm text-titanium outline-none transition-colors',
        'focus:bg-gunmetal/40 focus:text-white',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[inset]:pl-8',
        'data-[variant=destructive]:text-alert-red data-[variant=destructive]:focus:bg-alert-red/10 data-[variant=destructive]:focus:text-alert-red',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-ash [&_svg]:pointer-events-none [&_svg]:shrink-0",
        'data-[variant=destructive]:*:[svg]:text-alert-red!',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        'rounded-xs relative flex cursor-pointer select-none items-center gap-2 py-1.5 pl-8 pr-2 text-sm text-titanium outline-none transition-colors',
        'focus:bg-gunmetal/40 focus:text-white',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center text-tulpar-blue">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'rounded-xs relative flex cursor-pointer select-none items-center gap-2 py-1.5 pl-8 pr-2 text-sm text-titanium outline-none transition-colors',
        'focus:bg-gunmetal/40 focus:text-white',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center text-tulpar-blue">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium text-ash data-[inset]:pl-8',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-gunmetal/60', className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-ash/80', className)}
      {...props}
    />
  );
}
