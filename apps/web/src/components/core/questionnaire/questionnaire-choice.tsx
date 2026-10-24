'use client';

import * as React from 'react';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        'group/questionnaire-choices grid min-w-0 gap-2',
        className,
      )}
      {...props}
    />
  );
}

export function QuestionnaireChoice({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className={cn(
        'group/questionnaire-choice relative flex min-h-11 cursor-pointer select-none items-start gap-2.5 rounded-sm border border-gunmetal/80 bg-obsidian/40 px-3 py-2.5 text-start text-sm text-titanium outline-none transition-colors hover:bg-gunmetal/30',
        'has-[>input:focus-visible]:border-tulpar-blue has-[>input:focus-visible]:ring-1 has-[>input:focus-visible]:ring-tulpar-blue/50',
        'data-invalid:border-alert-red',
        'data-checked:border-tulpar-blue data-checked:bg-tulpar-blue/10',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="rounded-xs group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-checked/questionnaire-choice:border-tulpar-blue group-data-checked/questionnaire-choice:bg-tulpar-blue group-data-checked/questionnaire-choice:text-white pointer-events-none relative flex size-4 shrink-0 translate-y-0.5 items-center justify-center border border-gunmetal/80 bg-void-black group-data-[type=radio]/questionnaire-choice:rounded-full"
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="group-data-checked/questionnaire-choice:block hidden size-2 rounded-full bg-white group-data-[type=checkbox]/questionnaire-choice:hidden"
        />
        <Check
          data-slot="questionnaire-choice-indicator-check"
          className="group-data-checked/questionnaire-choice:block hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden"
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className="rounded-xs group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-0.5 items-center justify-center border border-gunmetal/80 bg-obsidian font-mono text-[0.625rem] font-medium leading-none text-ash group-data-[shortcut]/questionnaire-choice:inline-flex"
      />
    </QuestionnairePrimitive.Choice>
  );
}

export function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn('text-ash', className)}
      {...props}
    />
  );
}

export function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          'h-8 min-h-11 w-full min-w-0 rounded-sm border border-gunmetal/80 bg-void-black px-2.5 py-1 text-base text-titanium outline-none transition-[color,box-shadow,background-color]',
          'focus-visible:border-tulpar-blue focus-visible:ring-1 focus-visible:ring-tulpar-blue/50',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-alert-red aria-invalid:ring-1 aria-invalid:ring-alert-red/30',
          'selection:bg-tulpar-blue selection:text-white placeholder:text-ash/50 sm:min-h-0 md:text-sm',
          className,
        )}
        {...props}
      />
    </div>
  );
}
