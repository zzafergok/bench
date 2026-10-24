'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';
import { ChartContext } from './chart-context';
import { ChartStyle } from './chart-style';
import type { ChartContainerProps } from './types';

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs text-titanium [&_.recharts-cartesian-axis-tick_text]:fill-ash [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-gunmetal/30 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-gunmetal/40 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-gunmetal/30 [&_.recharts-radial-bar-background-sector]:fill-obsidian/40 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-gunmetal/20 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-gunmetal/30",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';
