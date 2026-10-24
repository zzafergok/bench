import React from 'react';
import { DatePicker } from './date-picker';
import type { DatePickerProps } from './types';

export function createSingleDatePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode="single" {...props} />;
}

export function createDateRangePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode="range" enablePresets {...props} />;
}

export function createMultipleDatePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode="multiple" {...props} />;
}

export function createDateTimePicker(props: Partial<DatePickerProps> = {}) {
  return <DatePicker mode="single" enableTime {...props} />;
}
