'use client';

import React from 'react';
import { Button } from '@/components/core/button';
import { Clock, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core/select';
import { timeZones } from './constants';
import type { DateRange, PresetOption } from './types';

interface DatePickerFooterProps {
  mode: 'single' | 'multiple' | 'range';
  value?: Date | Date[] | DateRange | null;
  clearable?: boolean;
  enableTime?: boolean;
  onClear: () => void;
  onClose: () => void;
}

export function DatePickerFooter({
  mode,
  value,
  clearable = true,
  enableTime = false,
  onClear,
  onClose,
}: DatePickerFooterProps) {
  const range =
    value && typeof value === 'object' && 'from' in value
      ? (value as DateRange)
      : null;

  return (
    <div className="flex items-center justify-between border-t border-gunmetal p-3">
      <div className="text-sm text-ash">
        {mode === 'multiple' && Array.isArray(value) && (
          <span>{value.length} tarih seçildi</span>
        )}
        {mode === 'range' && range && (
          <span>
            {range.from && range.to
              ? `${Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24) + 1)} gün`
              : 'Bitiş tarihi seçin'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {clearable && value && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Temizle
          </Button>
        )}
        <Button size="sm" onClick={onClose}>
          {enableTime ? 'Tamam' : 'Kapat'}
        </Button>
      </div>
    </div>
  );
}

interface PresetSidebarProps {
  enablePresets?: boolean;
  presets: PresetOption[];
  onPresetSelect: (value: Date | Date[] | DateRange) => void;
}

export function PresetSidebar({
  enablePresets = false,
  presets,
  onPresetSelect,
}: PresetSidebarProps) {
  if (!enablePresets || !presets.length) return null;

  return (
    <div className="w-48 border-r border-gunmetal p-3">
      <div className="mb-3 text-sm font-medium text-titanium">Hızlı Seçim</div>
      <div className="space-y-1">
        {presets.map((preset, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start px-2"
            onClick={() => onPresetSelect(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface TimePickerProps {
  hours: number;
  minutes: number;
  enableTimezone?: boolean;
  selectedTimezone: string;
  onTimeChange: (hours: number, minutes: number) => void;
  onTimezoneChange: (timezone: string) => void;
}

export function TimePicker({
  hours,
  minutes,
  enableTimezone = false,
  selectedTimezone,
  onTimeChange,
  onTimezoneChange,
}: TimePickerProps) {
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i).filter(
    (minute) => minute % 5 === 0,
  );

  return (
    <div className="border-t border-gunmetal p-3">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-ash" />
        <span className="text-sm font-medium">Saat</span>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={hours.toString()}
          onValueChange={(value) => onTimeChange(parseInt(value, 10), minutes)}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-ash">:</span>
        <Select
          value={minutes.toString()}
          onValueChange={(value) => onTimeChange(hours, parseInt(value, 10))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minuteOptions.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {enableTimezone && (
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-ash" />
            <span className="text-sm font-medium">Zaman Dilimi</span>
          </div>
          <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((timezone) => (
                <SelectItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
