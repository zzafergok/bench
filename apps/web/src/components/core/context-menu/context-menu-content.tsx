'use client';

import * as React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import {
  floatingMenuAnimationClassName,
  floatingMenuSurfaceClassName,
  menuItemBaseClassName,
} from '@/lib/utils/menu-styles';
import { cn } from '@/lib/utils';

export function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        menuItemBaseClassName,
        'cursor-pointer px-2 py-1.5 text-titanium',
        'focus:bg-gunmetal/40 focus:text-white',
        'data-[state=open]:bg-gunmetal/40 data-[inset]:pl-8 data-[state=open]:text-white',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-ash [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

export function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        floatingMenuSurfaceClassName,
        floatingMenuAnimationClassName,
        'origin-(--radix-context-menu-content-transform-origin) min-w-[8rem] p-1 shadow-lg',
        className,
      )}
      {...props}
    />
  );
}

export function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          floatingMenuSurfaceClassName,
          floatingMenuAnimationClassName,
          'max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) min-w-[8rem] overflow-y-auto overflow-x-hidden p-1',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}
