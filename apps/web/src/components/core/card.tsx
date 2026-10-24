'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size = 'default', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card flex select-none flex-col rounded-sm border border-gunmetal/30 bg-obsidian/60 text-titanium shadow-sm',
        '[--card-spacing:1.5rem] data-[size=sm]:[--card-spacing:1rem]',
        'gap-[var(--card-spacing)] py-[var(--card-spacing)]',
        'has-[[data-slot=card-footer]]:pb-0',
        '*:[img:first-child]:rounded-t-sm *:[img:last-child]:rounded-b-sm has-[>img:first-child]:pt-0',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        'group/card-header grid auto-rows-min items-start gap-1 px-[var(--card-spacing)]',
        'has-[[data-slot=card-action]]:grid-cols-[1fr_auto] has-[[data-slot=card-description]]:grid-rows-[auto_auto]',
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn(
        'col-start-1 text-lg font-semibold leading-tight tracking-tight text-titanium',
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn('col-start-1 text-sm leading-relaxed text-ash', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end rtl:justify-self-start',
        className,
      )}
      {...props}
    />
  ),
);
CardAction.displayName = 'CardAction';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('px-[var(--card-spacing)]', className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        'flex items-center px-[var(--card-spacing)] pb-[var(--card-spacing)]',
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';
