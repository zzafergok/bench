'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';
import { useChart } from './chart-context';
import type { ChartConfig, ChartTooltipContentProps } from './types';

export const ChartTooltip = RechartsPrimitive.Tooltip;

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-medium text-titanium', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return (
        <div className={cn('font-medium text-titanium', labelClassName)}>
          {value}
        </div>
      );
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-sm border border-gunmetal/40 bg-obsidian/95 px-2.5 py-1.5 text-xs shadow-xl backdrop-blur-xs',
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== 'none')
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || 'value'}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const indicatorColor = color || item.payload?.fill || item.color;

              return (
                <div
                  key={
                    typeof item.dataKey === 'string' ||
                    typeof item.dataKey === 'number'
                      ? item.dataKey
                      : index
                  }
                  className={cn(
                    'flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-ash',
                    indicator === 'dot' && 'items-center',
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              'border-(--color-border) bg-(--color-bg) shrink-0 rounded-[2px]',
                              {
                                'size-2.5': indicator === 'dot',
                                'w-1': indicator === 'line',
                                'w-0 border-[1.5px] border-dashed bg-transparent':
                                  indicator === 'dashed',
                                'my-0.5': nestLabel && indicator === 'dashed',
                              },
                            )}
                            style={
                              {
                                '--color-bg': indicatorColor,
                                '--color-border': indicatorColor,
                              } as React.CSSProperties
                            }
                          />
                        )
                      )}
                      <div
                        className={cn(
                          'flex flex-1 justify-between leading-none',
                          nestLabel ? 'items-end' : 'items-center',
                        )}
                      >
                        <div className="grid gap-1.5">
                          {nestLabel ? tooltipLabel : null}
                          <span className="text-ash">
                            {itemConfig?.label || item.name}
                          </span>
                        </div>
                        {item.value !== undefined && (
                          <span className="ml-2 font-mono font-medium tabular-nums text-titanium">
                            {typeof item.value === 'number'
                              ? item.value.toLocaleString()
                              : String(item.value)}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';
