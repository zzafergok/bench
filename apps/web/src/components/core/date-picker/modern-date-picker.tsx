'use client';

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { tr } from 'date-fns/locale/tr';
import { enUS } from 'date-fns/locale/en-US';

import { Button } from '@/components/core/button';
import { Calendar } from './calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/core/popover';
import { routing, toBCP47Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { datePickerCopy, quickDateOffsets } from './constants';
import type { ModernDatePickerProps } from './types';

interface QuickDatesSidebarProps {
  compact?: boolean;
  quickSelectionLabel: string;
  quickDates: string[];
  onQuickDateSelect: (offsetDays: number) => void;
}

export function QuickDatesSidebar({
  compact = false,
  quickSelectionLabel,
  quickDates,
  onQuickDateSelect,
}: QuickDatesSidebarProps) {
  return (
    <div
      className={cn(
        'border-gunmetal p-3',
        compact
          ? 'border-b'
          : 'border-b sm:w-32 sm:shrink-0 sm:border-b-0 sm:border-r',
      )}
    >
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ash/70">
        {quickSelectionLabel}
      </div>
      <div
        className={cn(
          compact
            ? 'grid grid-cols-2 gap-1'
            : 'grid grid-cols-2 gap-1 sm:block sm:space-y-1',
        )}
      >
        {quickDateOffsets.map((offsetDays, index) => (
          <Button
            type="button"
            key={offsetDays}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start truncate px-2 text-compact font-normal hover:bg-tulpar-blue/10"
            onClick={() => onQuickDateSelect(offsetDays)}
          >
            {quickDates[index]}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ModernDatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  clearable = true,
  minDate,
  maxDate,
  className,
  compact = false,
  error = false,
  includeTime = false,
  locale = routing.defaultLocale,
}: ModernDatePickerProps) {
  const copy = datePickerCopy[locale];
  const bcp47Locale = toBCP47Locale(locale);
  const dateLocale = locale === 'tr' ? tr : enUS;

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value ?? new Date());

  const displayValue = useMemo(() => {
    if (!value) return placeholder ?? copy.selectDate;
    return value.toLocaleDateString(bcp47Locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [bcp47Locale, copy.selectDate, value, placeholder]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (includeTime) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      onChange(d);
    } else {
      onChange(date);
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleQuickDateSelect = (offsetDays: number) => {
    const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    if (includeTime) date.setHours(0, 0, 0, 0);
    onChange(date);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-slot="modern-date-picker-trigger"
          className={cn(
            'h-10 w-full justify-start px-3 py-2 text-left font-normal',
            !value && 'text-ash/70',
            error && 'border-alert-red focus:border-alert-red',
            'transition-all duration-200 hover:bg-gunmetal/10',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-ash" />
          <span className="truncate">{displayValue}</span>
          {clearable && value && !disabled && (
            <X
              className="ml-auto h-4 w-4 shrink-0 text-ash transition-colors hover:text-titanium"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        data-slot="modern-date-picker-content"
        className={cn(
          'z-[150] max-w-[calc(100vw-2rem)] border border-gunmetal p-0 shadow-lg',
          compact
            ? 'w-[min(calc(100vw-2rem),18rem)]'
            : 'w-[min(calc(100vw-2rem),24rem)]',
        )}
        align="end"
        sideOffset={8}
        collisionPadding={12}
      >
        <div
          className={cn('flex', compact ? 'flex-col' : 'flex-col sm:flex-row')}
        >
          <QuickDatesSidebar
            compact={compact}
            quickSelectionLabel={copy.quickSelection as string}
            quickDates={copy.quickDates as string[]}
            onQuickDateSelect={handleQuickDateSelect}
          />

          <div className="flex-1">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={dateLocale}
              weekStartsOn={1}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              className="border-0 shadow-none"
            />

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gunmetal px-3 pb-3 pt-2">
              <div className="text-xs text-ash">
                {value
                  ? value.toLocaleDateString(bcp47Locale)
                  : (copy.noDate as string)}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-7 px-3 text-xs"
              >
                {copy.done as string}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
