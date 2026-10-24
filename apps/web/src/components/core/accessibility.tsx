'use client';

import * as React from 'react';

import { Link } from '@/components/core/link';
import { cn } from '@/lib/utils';

type LiveRegionPriority = 'polite' | 'assertive';

interface LiveRegionProps extends React.ComponentPropsWithoutRef<'div'> {
  /** A concise name announced before updates in the region. */
  label?: string;
  /** Context announced alongside updates in the region. */
  description?: string;
  /** Determines whether assistive technology may interrupt its current output. */
  priority?: LiveRegionPriority;
  /** Announces the full region on every update when enabled. */
  atomic?: boolean;
  /** Hides the region visually while retaining it for assistive technology. */
  visuallyHidden?: boolean;
}

/**
 * Announces asynchronous status changes without requiring consumers to compose
 * ARIA live-region attributes themselves.
 */
export function LiveRegion({
  atomic = true,
  children,
  className,
  description,
  id,
  label,
  priority = 'polite',
  visuallyHidden = false,
  ...props
}: LiveRegionProps) {
  const generatedId = React.useId();
  const descriptionId = description
    ? `${id ?? generatedId}-description`
    : undefined;

  return (
    <div
      {...props}
      id={id}
      aria-atomic={atomic}
      aria-describedby={descriptionId}
      aria-live={priority}
      aria-label={label}
      className={cn(visuallyHidden && 'sr-only', className)}
      data-slot="live-region"
      role={priority === 'assertive' ? 'alert' : 'status'}
    >
      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}
      {children}
    </div>
  );
}

interface SkipLinkProps extends Omit<
  React.ComponentProps<typeof Link>,
  'children' | 'href'
> {
  children?: React.ReactNode;
  href?: `#${string}`;
}

/**
 * Provides keyboard users a visible-on-focus shortcut to the primary landmark.
 */
export function SkipLink({
  children = 'Ana içeriğe geç',
  className,
  href = '#main-content',
  ...props
}: SkipLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-tulpar-blue focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-titanium focus:ring-offset-2 focus:ring-offset-obsidian',
        className,
      )}
      data-slot="skip-link"
    >
      {children}
    </Link>
  );
}

interface VisuallyHiddenProps extends React.ComponentPropsWithoutRef<'span'> {}

/** Keeps supporting text available to screen readers without displaying it. */
export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  VisuallyHiddenProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('sr-only', className)}
    data-slot="visually-hidden"
    {...props}
  />
));

VisuallyHidden.displayName = 'VisuallyHidden';
