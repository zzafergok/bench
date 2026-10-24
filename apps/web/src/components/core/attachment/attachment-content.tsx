'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAttachmentContext } from './attachment-context';
import type {
  AttachmentContentProps,
  AttachmentTitleProps,
  AttachmentDescriptionProps,
} from './types';

export const AttachmentContent = React.forwardRef<
  HTMLDivElement,
  AttachmentContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="attachment-content"
    className={cn(
      'flex min-w-0 flex-1 flex-col justify-center gap-0.5',
      className,
    )}
    {...props}
  />
));
AttachmentContent.displayName = 'AttachmentContent';

export const AttachmentTitle = React.forwardRef<
  HTMLParagraphElement,
  AttachmentTitleProps
>(({ className, ...props }, ref) => {
  const { state, size } = useAttachmentContext();
  const isShimmer = state === 'uploading' || state === 'processing';

  return (
    <p
      ref={ref}
      data-slot="attachment-title"
      className={cn(
        'truncate font-medium leading-tight text-titanium transition-colors',
        size === 'default' && 'text-sm',
        size === 'sm' && 'text-xs',
        size === 'xs' && 'text-[11px]',
        isShimmer && 'animate-pulse text-tulpar-blue',
        state === 'error' && 'text-alert-red',
        className,
      )}
      {...props}
    />
  );
});
AttachmentTitle.displayName = 'AttachmentTitle';

export const AttachmentDescription = React.forwardRef<
  HTMLParagraphElement,
  AttachmentDescriptionProps
>(({ className, ...props }, ref) => {
  const { state, size } = useAttachmentContext();

  return (
    <p
      ref={ref}
      data-slot="attachment-description"
      className={cn(
        'truncate leading-none text-ash transition-colors',
        size === 'xs' ? 'text-[10px]' : 'text-xs',
        state === 'error' && 'text-alert-red/80',
        className,
      )}
      {...props}
    />
  );
});
AttachmentDescription.displayName = 'AttachmentDescription';
