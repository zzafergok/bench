'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  format,
  getDay,
  getHours,
  getMinutes,
  isSameDay,
  setHours,
  setMinutes,
  type Locale as DateFnsLocale,
} from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { enUS } from 'date-fns/locale/en-US';
import { defaultPresets } from './constants';
import type { DatePickerProps, DateRange } from './types';

function formatDisplayValue(
  date: Date | Date[] | DateRange | null,
  dateFormat: string,
  timeFormat: string,
  enableTime: boolean,
  locale: DateFnsLocale,
): string {
  if (!date) return '';
  const formatDate = (value: Date) =>
    `${format(value, dateFormat, { locale })}${enableTime ? ` ${format(value, timeFormat, { locale })}` : ''}`;

  if (date instanceof Date) return formatDate(date);
  if (Array.isArray(date)) return date.map(formatDate).join(', ');
  if (date.from && date.to)
    return `${formatDate(date.from)} - ${formatDate(date.to)}`;
  if (date.from) return `${formatDate(date.from)} - ...`;
  return '';
}

function checkIsDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates: Date[] = [],
  disabledDaysOfWeek: number[] = [],
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates.some((disabledDate) => isSameDay(date, disabledDate)))
    return true;
  return disabledDaysOfWeek.includes(getDay(date));
}

export function useDatePicker({
  value,
  onChange,
  mode = 'single',
  enableTime = false,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  dateFormat = 'dd/MM/yyyy',
  timeFormat = 'HH:mm',
  locale = 'tr',
  customPresets,
}: DatePickerProps) {
  const [selectedTime, setSelectedTime] = useState({
    hours: value instanceof Date ? getHours(value) : 12,
    minutes: value instanceof Date ? getMinutes(value) : 0,
  });
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Istanbul');
  const dateLocale = locale === 'tr' ? tr : enUS;

  const inputValue = useMemo(
    () =>
      formatDisplayValue(
        value ?? null,
        dateFormat,
        timeFormat,
        enableTime,
        dateLocale,
      ),
    [value, dateFormat, timeFormat, enableTime, dateLocale],
  );

  // react-day-picker `disabled` prop'u tarafından kullanılır
  const isDateDisabled = useCallback(
    (date: Date) =>
      checkIsDateDisabled(
        date,
        minDate,
        maxDate,
        disabledDates,
        disabledDaysOfWeek,
      ),
    [minDate, maxDate, disabledDates, disabledDaysOfWeek],
  );

  const applySelectedTime = useCallback(
    (date: Date) =>
      enableTime
        ? setMinutes(setHours(date, selectedTime.hours), selectedTime.minutes)
        : date,
    [enableTime, selectedTime],
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      setSelectedTime({ hours, minutes });
      if (value instanceof Date) {
        onChange?.(setMinutes(setHours(value, hours), minutes));
      }
    },
    [value, onChange],
  );

  const handlePresetSelect = useCallback(
    (presetValue: Date | Date[] | DateRange) => {
      onChange?.(presetValue);
    },
    [onChange],
  );

  const handleClear = useCallback(() => onChange?.(null), [onChange]);

  const presets = useMemo(
    () =>
      customPresets ??
      (mode === 'range' ? defaultPresets.range : defaultPresets.single),
    [mode, customPresets],
  );

  return {
    selectedTime,
    selectedTimezone,
    setSelectedTimezone,
    inputValue,
    dateLocale,
    presets,
    isDateDisabled,
    applySelectedTime,
    handleTimeChange,
    handlePresetSelect,
    handleClear,
  };
}
