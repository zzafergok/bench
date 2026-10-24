import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TypesetProps extends React.ComponentProps<'div'> {
  variant?: 'docs' | 'chat' | 'reading' | 'compact' | 'large';
}

export function Typeset({ className, variant, ...props }: TypesetProps) {
  return (
    <div
      data-slot="typeset"
      className={cn('typeset', variant && `typeset-${variant}`, className)}
      {...props}
    />
  );
}
