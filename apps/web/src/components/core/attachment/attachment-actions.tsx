'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import type {
  AttachmentActionsProps,
  AttachmentActionProps,
  AttachmentTriggerProps,
} from './types';

export const AttachmentActions = React.forwardRef<
  HTMLDivElement,
  AttachmentActionsProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="attachment-actions"
    className={cn(
      'relative z-10 ml-auto flex shrink-0 items-center gap-1',
      className,
    )}
    {...props}
  />
));
AttachmentActions.displayName = 'AttachmentActions';

export const AttachmentAction = React.forwardRef<
  HTMLButtonElement,
  AttachmentActionProps
>(({ className, variant = 'ghost', ...props }, ref) => (
  <Button
    ref={ref}
    data-slot="attachment-action"
    variant={variant}
    className={cn(
      'size-7 rounded-sm p-0 text-ash hover:bg-gunmetal/40 hover:text-white focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
      className,
    )}
    {...props}
  />
));
AttachmentAction.displayName = 'AttachmentAction';

export const AttachmentTrigger = React.forwardRef<
  HTMLButtonElement,
  AttachmentTriggerProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      data-slot="attachment-trigger"
      type={asChild ? undefined : 'button'}
      className={cn(
        'absolute inset-0 z-0 cursor-pointer rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
        className,
      )}
      {...props}
    />
  );
});
AttachmentTrigger.displayName = 'AttachmentTrigger';
