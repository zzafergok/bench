'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAttachmentContext } from './attachment-context';
import type { AttachmentMediaProps } from './types';

export const AttachmentMedia = React.forwardRef<
  HTMLDivElement,
  AttachmentMediaProps
>(({ className, variant = 'icon', children, ...props }, ref) => {
  const { size, orientation } = useAttachmentContext();
  const isVertical = orientation === 'vertical';

  return (
    <div
      ref={ref}
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        'relative shrink-0 overflow-hidden rounded-sm',
        variant === 'icon' && [
          'flex items-center justify-center border border-gunmetal/30 bg-void-black/60 text-ash [&>svg]:text-current',
          size === 'default' && 'size-10 [&>svg]:size-5',
          size === 'sm' && 'size-8 [&>svg]:size-4',
          size === 'xs' && 'size-6 [&>svg]:size-3.5',
        ],
        variant === 'image' && [
          'border border-gunmetal/30 bg-void-black/40',
          !isVertical && [
            size === 'default' && 'size-12',
            size === 'sm' && 'size-10',
            size === 'xs' && 'size-8',
          ],
          isVertical && [
            'w-full',
            size === 'default' && 'h-28',
            size === 'sm' && 'h-24',
            size === 'xs' && 'h-20',
          ],
          '[&>img]:size-full [&>img]:object-cover',
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
AttachmentMedia.displayName = 'AttachmentMedia';
