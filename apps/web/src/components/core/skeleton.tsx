'use client';

import React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse bg-gunmetal/50 transition-colors', {
  variants: {
    variant: {
      default: 'rounded-sm',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      text: 'rounded-sm h-4',
    },
    animation: {
      pulse: 'animate-pulse',
      shimmer:
        'animate-shimmer bg-gradient-to-r from-gunmetal/50 via-gunmetal/30 to-gunmetal/50',
      wave: 'animate-wave',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    animation: 'pulse',
  },
});

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: number | string;
  height?: number | string;
  lines?: number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { className, variant, animation, width, height, lines, style, ...props },
    ref,
  ) => {
    const baseStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    // Çok satırlı metin iskeleti (skeleton)
    if (variant === 'text' && lines && lines > 1) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              data-slot="skeleton"
              className={cn(skeletonVariants({ variant, animation }))}
              style={{
                ...baseStyle,
                width:
                  index === lines - 1 && lines > 1 ? '75%' : baseStyle.width,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="skeleton"
        className={cn(skeletonVariants({ variant, animation }), className)}
        style={baseStyle}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

// Önceden tanımlanmış skeleton bileşenleri
export const SkeletonText = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'variant'> & { lines?: number }
>(({ lines = 1, ...props }, ref) => (
  <Skeleton ref={ref} variant="text" lines={lines} {...props} />
));

SkeletonText.displayName = 'SkeletonText';

export const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'variant' | 'width' | 'height'> & { size?: number }
>(({ size = 40, className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    variant="circular"
    width={size}
    height={size}
    className={className}
    {...props}
  />
));

SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'variant' | 'width' | 'height'>
>(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    variant="default"
    width={80}
    height={36}
    className={className}
    {...props}
  />
));

SkeletonButton.displayName = 'SkeletonButton';

export const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4 p-6', className)} {...props}>
    <div className="space-y-2">
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" lines={2} height={16} />
    </div>
    <Skeleton variant="rectangular" width="100%" height={200} />
    <div className="flex items-center space-x-4">
      <SkeletonAvatar size={32} />
      <div className="flex-1 space-y-1">
        <Skeleton variant="text" width="40%" height={14} />
        <Skeleton variant="text" width="60%" height={12} />
      </div>
    </div>
    {children}
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

// Kullanım örneği bileşeni
export function SkeletonExample() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Temel Skeleton Tipleri</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-ash">Text</h4>
            <SkeletonText lines={3} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-ash">Avatar</h4>
            <div className="flex items-center space-x-3">
              <SkeletonAvatar size={48} />
              <div className="space-y-2">
                <Skeleton variant="text" width={120} height={16} />
                <Skeleton variant="text" width={80} height={14} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-ash">Button</h4>
            <div className="flex space-x-2">
              <SkeletonButton />
              <SkeletonButton />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-ash">Image</h4>
            <Skeleton variant="rectangular" width="100%" height={120} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Animation Tipleri</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-ash">Pulse</h4>
            <Skeleton animation="pulse" width="100%" height={40} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-ash">Shimmer</h4>
            <Skeleton animation="shimmer" width="100%" height={40} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-ash">None</h4>
            <Skeleton animation="none" width="100%" height={40} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Kart Örneği</h3>
        <div className="max-w-md">
          <SkeletonCard className="rounded-lg border border-gunmetal" />
        </div>
      </div>
    </div>
  );
}
