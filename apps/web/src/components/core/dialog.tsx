'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/core/button';

export function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-void-black/80 backdrop-blur-xs',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}

function isPortalledFormControl(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('[data-radix-popper-content-wrapper]') !== null
  );
}

function isInsideDialogContent(
  target: EventTarget | null,
  content: HTMLElement | null,
): boolean {
  return target instanceof Node && Boolean(content?.contains(target));
}

export interface DialogContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Content
> {
  /** Controls whether Escape and outside interactions can close the dialog. */
  dismissible?: boolean;
  showCloseButton?: boolean;
  hideCloseButton?: boolean;
}

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      dismissible = true,
      showCloseButton = true,
      hideCloseButton = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      style,
      ...props
    },
    ref,
  ) => {
    const shouldShowCloseButton =
      dismissible && !hideCloseButton && showCloseButton;
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ref, contentRef);

    const shouldKeepDialogOpen = (target: EventTarget | null): boolean =>
      isPortalledFormControl(target) ||
      isInsideDialogContent(target, contentRef.current);

    return (
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={composedRef}
          data-slot="dialog-content"
          style={{
            ...style,
            pointerEvents: 'auto',
          }}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-sm border border-gunmetal/80 bg-obsidian p-6 text-titanium shadow-2xl outline-none duration-200 sm:max-w-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            className,
          )}
          onEscapeKeyDown={(event) => {
            onEscapeKeyDown?.(event);
            if (!event.defaultPrevented && !dismissible) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (
              !event.defaultPrevented &&
              (!dismissible || shouldKeepDialogOpen(event.target))
            ) {
              event.preventDefault();
            }
          }}
          onFocusOutside={(event) => {
            onFocusOutside?.(event);
            if (
              !event.defaultPrevented &&
              (!dismissible || shouldKeepDialogOpen(event.target))
            ) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            onInteractOutside?.(event);
            if (event.defaultPrevented) return;

            if (!dismissible || shouldKeepDialogOpen(event.target)) {
              event.preventDefault();
            }
          }}
          {...props}
        >
          {children}
          {shouldShowCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className="rounded-xs absolute right-4 top-4 text-ash opacity-70 transition-opacity hover:text-white hover:opacity-100 focus:outline-none disabled:pointer-events-none [&_svg]:size-4"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-white',
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-ash/80', className)}
      {...props}
    />
  );
}
