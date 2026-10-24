'use client';

import * as React from 'react';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';

import { cn } from '@/lib/utils';
import { buttonVariants, type Button } from '@/components/core/button';

export function QuestionnairePrevious({
  children,
  className,
  size = 'default',
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, 'size' | 'variant'>) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0',
        className,
      )}
      {...props}
    >
      {children ?? 'Previous'}
    </QuestionnairePrimitive.Previous>
  );
}

export function QuestionnaireSkip({
  children,
  className,
  size = 'default',
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, 'size' | 'variant'>) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0',
        className,
      )}
      {...props}
    >
      {children ?? 'Skip'}
    </QuestionnairePrimitive.Skip>
  );
}

export function QuestionnaireNext({
  children,
  className,
  size = 'default',
  variant = 'default',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, 'size' | 'variant'>) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0',
        className,
      )}
      {...props}
    >
      {children ?? 'Next'}
    </QuestionnairePrimitive.Next>
  );
}

export function QuestionnaireSubmit({
  children,
  className,
  size = 'default',
  variant = 'default',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  Pick<React.ComponentProps<typeof Button>, 'size' | 'variant'>) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0',
        className,
      )}
      {...props}
    >
      {children ?? 'Submit'}
    </QuestionnairePrimitive.Submit>
  );
}
