'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectItemProps } from './types';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      'shadow-xs flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-sm border border-gunmetal/80 bg-void-black px-3 py-1 font-mono text-sm text-titanium outline-none transition-colors',
      'placeholder:text-ash/50 focus:border-tulpar-blue/70 focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-alert-red aria-invalid:ring-1 aria-invalid:ring-alert-red/30',
      '[&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 shrink-0 text-ash" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      'flex cursor-default items-center justify-center py-1 text-ash',
      className,
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      'flex cursor-default items-center justify-center py-1 text-ash',
      className,
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

function getFocusableOutsideTarget(
  target: EventTarget | null,
): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  const focusableTarget = target.closest(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
  );

  return focusableTarget instanceof HTMLElement ? focusableTarget : null;
}

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      position = 'popper',
      onCloseAutoFocus,
      onPointerDownOutside,
      ...props
    },
    ref,
  ) => {
    const outsidePointerTargetRef = React.useRef<HTMLElement | null>(null);

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          data-slot="select-content"
          className={cn(
            'relative z-[10000] max-h-96 min-w-[8rem] overflow-hidden rounded-sm border border-gunmetal/60 bg-obsidian/95 p-1 text-titanium shadow-xl outline-none backdrop-blur-xs',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className,
          )}
          position={position}
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (event.defaultPrevented) return;

            outsidePointerTargetRef.current = getFocusableOutsideTarget(
              event.detail.originalEvent.target,
            );
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            if (event.defaultPrevented) return;

            const outsidePointerTarget = outsidePointerTargetRef.current;
            outsidePointerTargetRef.current = null;
            if (!outsidePointerTarget) return;

            event.preventDefault();
            window.requestAnimationFrame(() => {
              if (outsidePointerTarget.isConnected) {
                outsidePointerTarget.focus({ preventScroll: true });
              }
            });
          }}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            data-slot="select-viewport"
            className={cn(
              'p-1',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(
      'py-1.5 pl-8 pr-2 text-xs font-semibold text-titanium',
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, endAdornment, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      'rounded-xs relative flex w-full cursor-pointer select-none items-center py-1.5 pl-7 pr-2 font-mono text-xs text-titanium outline-none transition-colors',
      'focus:bg-gunmetal/40 focus:text-titanium data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator data-slot="select-item-indicator">
        <Check className="size-4 text-tulpar-blue" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
      {children}
    </SelectPrimitive.ItemText>
    {endAdornment && (
      <span aria-hidden="true" className="ml-auto shrink-0 pl-3">
        {endAdornment}
      </span>
    )}
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn('-mx-1 my-1 h-px bg-gunmetal/40', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
