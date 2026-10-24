'use client';

import React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StepperProps {
  activeStep: number;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}

interface StepperItemProps {
  step?: number;
  title: string;
  isLast?: boolean;
  isActive?: boolean;
  description?: string;
  isCompleted?: boolean;
  completedLabel?: string;
}

export function Stepper({
  children,
  className,
  activeStep = 1,
  ariaLabel = 'Progress',
}: StepperProps) {
  const childCount = React.Children.count(children);

  return (
    <ol
      aria-label={ariaLabel}
      className={cn('flex w-full items-start', className)}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement<StepperItemProps>(child)
          ? React.cloneElement(child, {
              step: index + 1,
              isActive: activeStep === index + 1,
              isCompleted: activeStep > index + 1,
              isLast: index === childCount - 1,
            })
          : child,
      )}
    </ol>
  );
}

export function StepperItem({
  title,
  isActive,
  isLast = false,
  step = 1,
  description,
  isCompleted,
  completedLabel = 'Completed',
}: StepperItemProps) {
  return (
    <li
      aria-current={isActive ? 'step' : undefined}
      className={cn('flex min-w-0 items-start', !isLast && 'flex-1')}
    >
      <div className="flex min-w-0 flex-col items-center">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-colors sm:h-10 sm:w-10 sm:text-sm',
            isActive || isCompleted
              ? 'border-tulpar-blue bg-tulpar-blue text-white'
              : 'border-border bg-background text-muted-foreground',
          )}
        >
          {isCompleted ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{completedLabel}</span>
            </>
          ) : (
            step
          )}
        </div>
        <div className="mt-2 max-w-24 text-center sm:max-w-40">
          <div
            className={cn(
              'text-2xs font-bold uppercase tracking-wider sm:text-xs',
              isActive
                ? 'text-tulpar-blue'
                : isCompleted
                  ? 'text-foreground'
                  : 'text-muted-foreground',
            )}
          >
            {title}
          </div>
          {description && (
            <div className="mt-1 hidden text-xs text-muted-foreground sm:block">
              {description}
            </div>
          )}
        </div>
      </div>
      {!isLast && (
        <div
          aria-hidden="true"
          className={cn(
            'mx-2 mt-[18px] h-0.5 min-w-3 flex-1 transition-colors sm:mx-4 sm:mt-5',
            isCompleted ? 'bg-tulpar-blue' : 'bg-border',
          )}
        />
      )}
    </li>
  );
}
