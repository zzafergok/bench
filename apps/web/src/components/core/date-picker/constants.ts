import { addDays, startOfMonth, endOfMonth } from 'date-fns';
import type { PresetOption, TimeZoneOption } from './types';

export const timeZones: TimeZoneOption[] = [
  { value: 'Europe/Istanbul', label: 'İstanbul (GMT+3)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export const defaultPresets: {
  single: PresetOption[];
  range: PresetOption[];
} = {
  single: [
    { label: 'Bugün', value: new Date() },
    { label: 'Yarın', value: addDays(new Date(), 1) },
    { label: 'Bir hafta sonra', value: addDays(new Date(), 7) },
  ],
  range: [
    {
      label: 'Son 7 gün',
      value: { from: addDays(new Date(), -7), to: new Date() },
    },
    {
      label: 'Son 30 gün',
      value: { from: addDays(new Date(), -30), to: new Date() },
    },
    {
      label: 'Bu ay',
      value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
  ],
};

import type { Locale } from '@/i18n/routing';

export const datePickerCopy = {
  tr: {
    quickSelection: 'Hızlı Seçim',
    quickDates: [
      'Bugün',
      'Yarın',
      '1 Hafta Sonra',
      '2 Hafta Sonra',
      '1 Ay Sonra',
    ],
    days: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'],
    noDate: 'Tarih seçilmedi',
    selectDate: 'Tarih seçin',
    done: 'Tamam',
    previousMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
  },
  en: {
    quickSelection: 'Quick Select',
    quickDates: ['Today', 'Tomorrow', 'In 1 Week', 'In 2 Weeks', 'In 1 Month'],
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    noDate: 'No date selected',
    selectDate: 'Select date',
    done: 'Done',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export const quickDateOffsets = [0, 1, 7, 14, 30] as const;

export const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

export interface QuickDateItem {
  label: string;
  getValue: () => string;
}

export const QUICK_DATES: QuickDateItem[] = [
  {
    label: 'Bu Ay',
    getValue: () => {
      const n = new Date();
      return `${n.getFullYear()}-${(n.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
  {
    label: 'Geçen Ay',
    getValue: () => {
      const n = new Date();
      n.setMonth(n.getMonth() - 1);
      return `${n.getFullYear()}-${(n.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
  {
    label: '6 Ay Önce',
    getValue: () => {
      const n = new Date();
      n.setMonth(n.getMonth() - 6);
      return `${n.getFullYear()}-${(n.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
  {
    label: '1 Yıl Önce',
    getValue: () => {
      const n = new Date();
      n.setFullYear(n.getFullYear() - 1);
      return `${n.getFullYear()}-${(n.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
];
