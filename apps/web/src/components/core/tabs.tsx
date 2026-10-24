'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    data-orientation={orientation}
    orientation={orientation}
    className={cn(
      'group/tabs flex flex-col gap-2 data-[orientation=vertical]:flex-row',
      className,
    )}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

export interface TabsListProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {
  variant?: 'default' | 'line';
}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    data-variant={variant}
    className={cn(
      'group/tabs-list inline-flex h-9 w-fit items-center justify-center rounded-sm border border-gunmetal/80 bg-void-black p-1 text-ash group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
      variant === 'line' &&
        'gap-1 rounded-none border-b border-gunmetal/60 bg-transparent p-0 group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-r group-data-[orientation=vertical]/tabs:border-gunmetal/60',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      'rounded-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1 font-mono text-xs font-medium text-ash outline-none transition-all',
      'hover:text-titanium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      'group-data-[variant=default]/tabs-list:data-[state=active]:shadow-xs group-data-[variant=default]/tabs-list:data-[state=active]:bg-obsidian group-data-[variant=default]/tabs-list:data-[state=active]:text-titanium',
      'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:border-b-0 group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:border-r-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:px-2 group-data-[variant=line]/tabs-list:py-1.5 group-data-[variant=line]/tabs-list:data-[state=active]:border-tulpar-blue group-data-[variant=line]/tabs-list:data-[state=active]:text-titanium',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(
      'flex-1 font-mono text-sm text-titanium outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
