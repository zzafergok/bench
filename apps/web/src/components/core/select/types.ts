import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

export interface NativeSelectOption {
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  label: React.ReactNode;
  value: string | number;
}

export type NativeSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'defaultValue' | 'onChange' | 'value'
> & {
  options?: NativeSelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  endAdornment?: React.ReactNode;
}
