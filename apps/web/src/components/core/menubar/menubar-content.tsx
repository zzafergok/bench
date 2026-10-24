'use client';

import * as React from 'react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import { ChevronRight } from 'lucide-react';

import {
  floatingMenuAnimationClassName,
  floatingMenuSurfaceClassName,
  menuItemBaseClassName,
} from '@/lib/utils/menu-styles';
import { cn } from '@/lib/utils';

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    data-slot="menubar-sub-trigger"
    className={cn(
      menuItemBaseClassName,
      'cursor-default px-2 py-1.5 text-titanium focus:bg-gunmetal/40 focus:text-titanium data-[state=open]:bg-gunmetal/40 data-[state=open]:text-titanium',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4 text-ash" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    data-slot="menubar-sub-content"
    className={cn(
      floatingMenuSurfaceClassName,
      floatingMenuAnimationClassName,
      'origin-(--radix-menubar-content-transform-origin) min-w-[8rem] p-1 outline-none',
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          floatingMenuSurfaceClassName,
          floatingMenuAnimationClassName,
          'origin-(--radix-menubar-content-transform-origin) min-w-[12rem] p-1 outline-none',
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  ),
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;
