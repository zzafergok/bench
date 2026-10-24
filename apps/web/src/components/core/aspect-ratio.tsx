'use client';

import * as React from 'react';
import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<
  typeof AspectRatioPrimitive.Root
> {}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>((props, ref) => (
  <AspectRatioPrimitive.Root ref={ref} data-slot="aspect-ratio" {...props} />
));

AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };
