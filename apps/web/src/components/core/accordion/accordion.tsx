'use client';

import { AccordionRoot } from './accordion-root';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';
import { AccordionContent } from './accordion-content';

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
