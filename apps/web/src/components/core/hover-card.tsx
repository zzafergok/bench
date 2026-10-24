'use client';

import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

export function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

export function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

export function HoverCardPortal({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Portal>) {
  return <HoverCardPrimitive.Portal data-slot="hover-card-portal" {...props} />;
}

export function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'origin-(--radix-hover-card-content-transform-origin) z-50 w-64 rounded-sm border border-gunmetal/60 bg-obsidian/95 p-4 text-titanium shadow-xl outline-none backdrop-blur-xs',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
