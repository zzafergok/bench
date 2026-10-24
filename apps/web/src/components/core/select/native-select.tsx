'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from './select-primitives';
import type { NativeSelectProps } from './types';

/**
 * Form-friendly adapter around the Radix Select primitives. It accepts
 * native-looking option children so existing controlled form code can use a
 * custom select without emitting a browser `<select>` element.
 */
export const NativeSelect = ({
  children,
  className,
  defaultValue,
  disabled,
  id,
  name,
  onChange,
  options: providedOptions,
  required,
  value,
  ...props
}: NativeSelectProps) => {
  void props;

  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue === undefined ? undefined : String(defaultValue),
  );
  const selectedValue = value === undefined ? uncontrolledValue : String(value);

  const childOptions = React.Children.toArray(children).flatMap((child) => {
    if (
      !React.isValidElement<React.OptionHTMLAttributes<HTMLOptionElement>>(
        child,
      )
    ) {
      return [];
    }

    return [
      {
        disabled: child.props.disabled,
        endAdornment: undefined,
        label: child.props.children,
        value: String(child.props.value ?? ''),
      },
    ];
  });

  const options = providedOptions
    ? providedOptions.map((option) => ({
        ...option,
        value: String(option.value),
      }))
    : childOptions;

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const handleValueChange = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onChange?.({
      currentTarget: { id, name, value: nextValue },
      target: { id, name, value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Select
      value={selectedValue}
      defaultValue={
        defaultValue === undefined ? undefined : String(defaultValue)
      }
      onValueChange={handleValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger
        id={id}
        aria-required={required}
        className={cn(
          'rounded-none border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-tulpar-blue',
          className,
        )}
      >
        <SelectValue placeholder="Seçiniz">
          {selectedValue ? (selectedOption?.label ?? selectedValue) : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            endAdornment={option.endAdornment}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
NativeSelect.displayName = 'NativeSelect';
