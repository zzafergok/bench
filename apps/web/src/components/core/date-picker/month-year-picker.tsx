'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/core/popover';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import { MONTHS } from './constants';
import { MonthYearGrid, MonthYearSidebar } from './month-year-parts';
import type { MonthYearPickerProps } from './types';
import type { QuickDateItem } from './constants';

export function MonthYearPicker({
  value,
  minDate,
  maxDate,
  onChange,
  className,
  error = false,
  disabled = false,
  clearable = true,
  placeholder = 'Ay/Yıl seçin',
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentDate = useMemo(() => {
    if (value) {
      const [year, month] = value.split('-');
      return { year: parseInt(year, 10), month: parseInt(month, 10) - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [value]);

  const [currentYear, setCurrentYear] = useState(currentDate.year);

  const displayValue = useMemo(() => {
    if (!value) return placeholder;
    const [year, month] = value.split('-');
    return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
  }, [value, placeholder]);

  const handleMonthSelect = (monthIndex: number) => {
    const monthStr = (monthIndex + 1).toString().padStart(2, '0');
    const newValue = `${currentYear}-${monthStr}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleQuickDateSelect = (quickDate: QuickDateItem) => {
    const dateValue = quickDate.getValue();
    onChange(dateValue);
    setIsOpen(false);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear((prev) => (direction === 'prev' ? prev - 1 : prev + 1));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-10 w-full justify-start px-3 py-2 text-left font-normal',
            !value && 'text-ash/70',
            error && 'border-alert-red focus:border-alert-red',
            'hover:bg-gunmetal/10',
            'transition-all duration-200',
            className,
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4 shrink-0 text-ash" />
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
        className="w-auto border border-gunmetal p-0 shadow-lg"
        align="start"
      >
        <div className="flex">
          <MonthYearSidebar onQuickDateSelect={handleQuickDateSelect} />

          <MonthYearGrid
            currentYear={currentYear}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            displayValue={displayValue}
            onNavigateYear={navigateYear}
            onMonthSelect={handleMonthSelect}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
