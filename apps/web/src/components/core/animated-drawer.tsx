'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from './button';

export interface AnimatedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  placement?: 'right' | 'left' | 'top' | 'bottom';
  maskClosable?: boolean;
  showCloseButton?: boolean;
}

const animatedDrawerSizes = {
  sm: 'w-screen sm:w-96 sm:max-w-sm',
  md: 'w-screen sm:w-[28rem] sm:max-w-md',
  lg: 'w-screen sm:w-[36rem] sm:max-w-2xl',
  xl: 'w-screen sm:w-[42rem] sm:max-w-3xl',
};

function getPlacementClasses(
  placement: AnimatedDrawerProps['placement'],
  size: AnimatedDrawerProps['size'] = 'md',
) {
  const s = animatedDrawerSizes[size];
  switch (placement) {
    case 'left':
      return `top-0 bottom-0 left-0 right-0 sm:right-auto ${s}`;
    case 'top':
      return 'top-0 bottom-0 left-0 right-0 sm:bottom-auto h-screen sm:h-80';
    case 'bottom':
      return 'top-0 bottom-0 left-0 right-0 sm:top-auto h-screen sm:h-80';
    default: // sağ (right)
      return `top-0 bottom-0 left-0 right-0 sm:left-auto ${s}`;
  }
}

function getAnimationVariants(placement: AnimatedDrawerProps['placement']) {
  switch (placement) {
    case 'left':
      return {
        initial: { opacity: 0, x: '-100%' },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: '-100%' },
      };
    case 'top':
      return {
        initial: { opacity: 0, y: '-100%' },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: '-100%' },
      };
    case 'bottom':
      return {
        initial: { opacity: 0, y: '100%' },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: '100%' },
      };
    default: // sağ (right)
      return {
        initial: { opacity: 0, x: '100%' },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: '100%' },
      };
  }
}

export function AnimatedDrawer({
  open,
  onOpenChange,
  title,
  footer,
  children,
  className,
  size = 'md',
  placement = 'right',
  maskClosable = true,
  showCloseButton = true,
}: AnimatedDrawerProps) {
  const mounted = useMounted();

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onOpenChange(false);
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            data-slot="animated-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9998 hidden bg-black/50 backdrop-blur-sm sm:block"
            onClick={maskClosable ? () => onOpenChange(false) : undefined}
          />

          <motion.div
            data-slot="animated-drawer-content"
            {...getAnimationVariants(placement)}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className={cn(
              'fixed z-9999 flex flex-col border border-gunmetal/50 bg-void-black shadow-2xl',
              getPlacementClasses(placement, size),
              className,
            )}
          >
            {(title || showCloseButton) && (
              <div
                data-slot="animated-drawer-header"
                className="flex items-center justify-between border-b border-gunmetal bg-obsidian p-4 sm:p-6"
              >
                {title && (
                  <p className="flex-1 truncate pr-4 text-base font-semibold text-titanium sm:text-lg">
                    {title}
                  </p>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                  >
                    <XIcon className="size-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                )}
              </div>
            )}

            <div
              data-slot="animated-drawer-body"
              className="flex-1 overflow-y-auto p-4 sm:p-6"
            >
              {children}
            </div>

            {footer && (
              <div
                data-slot="animated-drawer-footer"
                className="border-t border-gunmetal/30 bg-gunmetal/10 p-4 sm:p-6"
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(content, document.body) : null;
}

export function useDrawer() {
  const [open, setOpen] = React.useState(false);
  const openDrawer = React.useCallback(() => setOpen(true), []);
  const closeDrawer = React.useCallback(() => setOpen(false), []);
  const toggleDrawer = React.useCallback(() => setOpen((prev) => !prev), []);
  return { open, openDrawer, closeDrawer, toggleDrawer, setOpen };
}
