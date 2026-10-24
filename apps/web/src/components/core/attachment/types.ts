import type * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { ButtonProps } from '@/components/core/button';
import type { attachmentVariants } from './attachment-variants';

export type AttachmentState =
  'idle' | 'uploading' | 'processing' | 'error' | 'done';

export type AttachmentSize = 'default' | 'sm' | 'xs';

export type AttachmentOrientation = 'horizontal' | 'vertical';

export interface AttachmentContextValue {
  state: AttachmentState;
  size: AttachmentSize;
  orientation: AttachmentOrientation;
}

export interface AttachmentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof attachmentVariants> {
  state?: AttachmentState;
  size?: AttachmentSize;
  orientation?: AttachmentOrientation;
}

export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'icon' | 'image';
}

export interface AttachmentContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface AttachmentTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface AttachmentDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface AttachmentActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface AttachmentActionProps extends ButtonProps {}

export interface AttachmentTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface AttachmentGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
