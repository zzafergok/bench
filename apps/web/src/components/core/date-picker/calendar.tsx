'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/core/button';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  locale,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'select-none rounded-sm border border-gunmetal/30 bg-obsidian/60 p-3 text-titanium',
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn(defaultClassNames.root, 'relative'),
        months: cn(
          defaultClassNames.months,
          'relative flex flex-col gap-4 sm:flex-row',
        ),
        month: cn(defaultClassNames.month, 'space-y-4'),
        month_caption: cn(
          defaultClassNames.month_caption,
          'relative flex h-7 items-center justify-center pt-1 text-sm font-medium text-titanium',
        ),
        caption_label: cn(
          defaultClassNames.caption_label,
          'text-sm font-medium',
        ),
        nav: cn(
          defaultClassNames.nav,
          'absolute inset-x-0 top-0 flex items-center justify-between gap-1',
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-7 bg-transparent p-0 text-ash hover:bg-gunmetal/40 hover:text-white',
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-7 bg-transparent p-0 text-ash hover:bg-gunmetal/40 hover:text-white',
        ),
        month_grid: cn(
          defaultClassNames.month_grid,
          'w-full border-collapse space-y-1',
        ),
        weekdays: cn(defaultClassNames.weekdays, 'flex'),
        weekday: cn(
          defaultClassNames.weekday,
          'w-9 rounded-sm text-center text-[0.8rem] font-normal text-ash',
        ),
        week: cn(defaultClassNames.week, 'mt-2 flex w-full'),
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-tulpar-blue/10 [&:has([aria-selected].day-range-end)]:rounded-e-sm [&:has([aria-selected].day-outside)]:bg-transparent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-e-sm [&:has(>.day-range-start)]:rounded-s-sm first:[&:has([aria-selected])]:rounded-s-sm last:[&:has([aria-selected])]:rounded-e-sm'
            : '[&:has([aria-selected])]:rounded-sm',
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 rounded-sm p-0 font-normal transition-colors hover:bg-gunmetal/40 hover:text-white aria-selected:opacity-100',
        ),
        range_start:
          'day-range-start rounded-s-sm bg-tulpar-blue text-white hover:bg-tulpar-blue',
        range_end:
          'day-range-end rounded-e-sm bg-tulpar-blue text-white hover:bg-tulpar-blue',
        selected:
          'rounded-sm bg-tulpar-blue text-white hover:bg-tulpar-blue hover:text-white focus:bg-tulpar-blue focus:text-white',
        today: 'rounded-sm bg-gunmetal/40 font-bold text-tulpar-blue',
        outside:
          'day-outside text-ash/40 aria-selected:bg-tulpar-blue/5 aria-selected:text-ash/60',
        disabled: 'cursor-not-allowed text-ash/30 opacity-50',
        range_middle:
          'rounded-none aria-selected:bg-tulpar-blue/10 aria-selected:text-tulpar-blue',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeft
                className="size-4 rtl:rotate-180"
                {...chevronProps}
              />
            );
          }
          return (
            <ChevronRight className="size-4 rtl:rotate-180" {...chevronProps} />
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
