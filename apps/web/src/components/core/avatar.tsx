'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type AvatarSize = 'default' | 'sm' | 'lg';

export interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> {
  size?: AvatarSize;
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = 'default', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    data-size={size}
    className={cn(
      'relative flex shrink-0 select-none rounded-sm border border-gunmetal/30',
      size === 'sm' && 'size-8 text-xs',
      size === 'default' && 'size-10 text-sm',
      size === 'lg' && 'size-12 text-base',
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
> {}

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn(
      'aspect-square h-full w-full rounded-sm object-cover',
      className,
    )}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
> {}

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      'flex h-full w-full items-center justify-center rounded-sm bg-gunmetal/30 font-medium text-ash',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export interface AvatarBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarBadge = React.forwardRef<HTMLDivElement, AvatarBadgeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="avatar-badge"
      className={cn(
        'absolute bottom-0 right-0 z-10 flex size-3.5 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-signal-green text-[9px] text-white ring-2 ring-obsidian rtl:left-0 rtl:right-auto rtl:-translate-x-1/4 [&>svg]:size-2.5',
        className,
      )}
      {...props}
    />
  ),
);
AvatarBadge.displayName = 'AvatarBadge';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="avatar-group"
      className={cn(
        'flex items-center -space-x-2 rtl:space-x-reverse [&>[data-slot=avatar-group-count]]:ring-2 [&>[data-slot=avatar-group-count]]:ring-obsidian [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-obsidian',
        className,
      )}
      {...props}
    />
  ),
);
AvatarGroup.displayName = 'AvatarGroup';

export interface AvatarGroupCountProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  AvatarGroupCountProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="avatar-group-count"
    className={cn(
      'relative flex size-10 shrink-0 select-none items-center justify-center rounded-sm border border-gunmetal/30 bg-gunmetal/30 text-xs font-medium text-ash [&>svg]:size-4',
      className,
    )}
    {...props}
  />
));
AvatarGroupCount.displayName = 'AvatarGroupCount';
