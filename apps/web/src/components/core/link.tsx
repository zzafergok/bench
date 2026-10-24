import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import * as React from 'react';

import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from '@/components/core/button';

import { cn } from '@/lib/utils';

export interface LinkProps
  extends
    NextLinkProps,
    VariantProps<typeof buttonVariants>,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <NextLink
        className={cn(
          variant || size ? buttonVariants({ variant, size }) : undefined,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Link.displayName = 'Link';

export { Link };
