export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface PresetOption {
  label: string;
  value: Date | DateRange | Date[];
}

export interface TimeZoneOption {
  value: string;
  label: string;
}

export interface DatePickerProps {
  // Değer özellikleri (props)
  value?: Date | Date[] | DateRange | null;
  onChange?: (date: Date | Date[] | DateRange | null) => void;

  // Mod yapılandırması
  mode?: 'single' | 'multiple' | 'range';
  enableTime?: boolean;
  enableTimezone?: boolean;

  // Tarih kısıtlamaları
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[]; // 0-6 (Pazar-Cumartesi)

  // Görüntüleme seçenekleri
  placeholder?: string;
  dateFormat?: string;
  timeFormat?: string;
  locale?: 'tr' | 'en';
  showWeekNumbers?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  // Arayüz yapılandırması
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  /** Displays the clear/close action row below the calendar. */
  showFooter?: boolean;
  className?: string;

  // Gelişmiş özellikler
  enablePresets?: boolean;
  customPresets?: PresetOption[];

  // Olaylar (Events)
  onFocus?: () => void;
  onBlur?: () => void;
  onMonthChange?: (month: Date) => void;
  onYearChange?: (year: number) => void;
}

import type { Locale } from '@/i18n/routing';

export interface ModernDatePickerProps {
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
  value?: Date | null;
  clearable?: boolean;
  placeholder?: string;
  includeTime?: boolean;
  locale?: Locale;
  onChange: (date: Date | null) => void;
}

export interface MonthYearPickerProps {
  value?: string; // Format: "YYYY-MM"
  error?: boolean;
  minDate?: string; // Format: "YYYY-MM"
  maxDate?: string; // Format: "YYYY-MM"
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
  placeholder?: string;
  onChange: (value: string | null) => void;
}
