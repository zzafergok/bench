import type * as React from 'react';
import type * as RechartsPrimitive from 'recharts';
import type {
  Payload as TooltipPayload,
  ValueType as TooltipValueType,
  NameType as TooltipNameType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent';

export type {
  TooltipPayload,
  TooltipValueType,
  TooltipNameType,
  LegendPayload,
};

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
>;

export interface ChartContextProps {
  config: ChartConfig;
}

export interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
  initialDimension?: {
    width: number;
    height: number;
  };
}

export interface ChartTooltipContentProps extends Omit<
  React.ComponentProps<'div'>,
  'content'
> {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayload<TooltipValueType, TooltipNameType>>;
  label?: React.ReactNode;
  labelFormatter?: (
    label: unknown,
    payload: ReadonlyArray<TooltipPayload<TooltipValueType, TooltipNameType>>,
  ) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: unknown,
    name: unknown,
    item: TooltipPayload<TooltipValueType, TooltipNameType>,
    index: number,
    payload: unknown,
  ) => React.ReactNode;
  color?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
}

export interface ChartLegendContentProps extends React.ComponentProps<'div'> {
  payload?: ReadonlyArray<LegendPayload>;
  verticalAlign?: 'top' | 'bottom' | 'middle';
  hideIcon?: boolean;
  nameKey?: string;
}
