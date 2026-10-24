import type * as React from 'react';
import type { Accordion as AccordionPrimitive } from 'radix-ui';

export type AccordionRootProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
>;

export type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
>;

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  hideIcon?: boolean;
}

export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;
