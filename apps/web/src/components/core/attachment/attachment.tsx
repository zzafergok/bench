'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AttachmentContext } from './attachment-context';
import { attachmentVariants } from './attachment-variants';
import type { AttachmentProps, AttachmentGroupProps } from './types';

export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      state = 'done',
      size = 'default',
      orientation = 'horizontal',
      children,
      ...props
    },
    ref,
  ) => {
    const contextValue = React.useMemo(
      () => ({ state, size, orientation }),
      [state, size, orientation],
    );

    return (
      <AttachmentContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="attachment"
          data-state={state}
          data-size={size}
          data-orientation={orientation}
          className={cn(
            attachmentVariants({ orientation, size, state }),
            'has-data-[slot=attachment-trigger]:hover:border-tulpar-blue/50 has-data-[slot=attachment-trigger]:hover:bg-gunmetal/20',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AttachmentContext.Provider>
    );
  },
);
Attachment.displayName = 'Attachment';

export const AttachmentGroup = React.forwardRef<
  HTMLDivElement,
  AttachmentGroupProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="attachment-group"
    className={cn(
      'relative flex w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto pb-1 scrollbar-hide',
      className,
    )}
    {...props}
  />
));
AttachmentGroup.displayName = 'AttachmentGroup';
