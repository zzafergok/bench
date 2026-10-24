'use client';

import * as React from 'react';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';

import { cn } from '@/lib/utils';

export function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn('flex w-full min-w-0 flex-col gap-4', className)}
      {...props}
    />
  );
}

export function QuestionnaireProgress({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        'min-h-[1lh] w-fit min-w-[14ch] text-xs font-medium tabular-nums text-ash',
        className,
      )}
      {...props}
    />
  );
}

export function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        'flex min-w-0 flex-col gap-4 border-0 p-0 outline-none',
        className,
      )}
      {...props}
    />
  );
}

export function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        'text-pretty text-base font-medium leading-snug text-titanium [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4',
        className,
      )}
      {...props}
    />
  );
}

export function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn('text-pretty text-sm text-ash', className)}
      {...props}
    />
  );
}

export function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn('mt-2 text-sm text-alert-red', className)}
      {...props}
    />
  );
}

export function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        'grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-8',
        className,
      )}
      {...props}
    />
  );
}
