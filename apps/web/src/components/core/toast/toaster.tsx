'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react';
import {
  CheckCircle2Icon,
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  Loader2Icon,
  XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from './toast-manager';

function ToastIcon({ type }: { type?: string }) {
  switch (type) {
    case 'success':
      return <CheckCircle2Icon className="size-4 shrink-0 text-signal-green" />;
    case 'error':
      return <AlertCircleIcon className="size-4 shrink-0 text-alert-red" />;
    case 'warning':
      return <AlertTriangleIcon className="size-4 shrink-0 text-tulpar-gold" />;
    case 'loading':
      return <Loader2Icon className="size-4 shrink-0 animate-spin text-ash" />;
    case 'info':
      return <InfoIcon className="size-4 shrink-0 text-tulpar-blue" />;
    default:
      return null;
  }
}

export function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return (
    <>
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          toast={t}
          data-slot="toast"
          className={cn(
            'group/toast pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-sm border border-gunmetal/80 bg-obsidian p-4 font-mono text-titanium shadow-2xl transition-all',
            'data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0',
            'data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0',
          )}
        >
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <ToastIcon type={t.type} />
            <div className="grid min-w-0 flex-1 gap-1">
              {t.title && (
                <ToastPrimitive.Title
                  data-slot="toast-title"
                  className="text-sm font-semibold leading-snug text-white"
                >
                  {t.title}
                </ToastPrimitive.Title>
              )}
              {t.description && (
                <ToastPrimitive.Description
                  data-slot="toast-description"
                  className="text-xs leading-relaxed text-ash/80"
                >
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
          </div>
          {t.actionProps && (
            <ToastPrimitive.Action
              data-slot="toast-action"
              {...t.actionProps}
              className={cn(
                'rounded-xs inline-flex h-7 shrink-0 items-center justify-center border border-gunmetal/80 bg-void-black px-2.5 font-mono text-xs font-medium text-titanium transition-colors hover:bg-gunmetal/40 focus:outline-none focus:ring-1 focus:ring-tulpar-blue/50 disabled:pointer-events-none disabled:opacity-50',
                t.actionProps.className,
              )}
            />
          )}
          <ToastPrimitive.Close
            data-slot="toast-close"
            className="rounded-xs shrink-0 p-1 text-ash opacity-70 transition-opacity hover:text-white hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-tulpar-blue/50"
          >
            <XIcon className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </>
  );
}

export function Toaster({
  position = 'bottom-right',
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport> & {
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
}) {
  return (
    <ToastPrimitive.Provider toastManager={toast}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          className={cn(
            'fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]',
            position === 'bottom-right' && 'bottom-0 right-0',
            position === 'bottom-left' && 'bottom-0 left-0',
            position === 'top-right' && 'right-0 top-0',
            position === 'top-left' && 'left-0 top-0',
            position === 'top-center' && 'left-1/2 top-0 -translate-x-1/2',
            position === 'bottom-center' &&
              'bottom-0 left-1/2 -translate-x-1/2',
            className,
          )}
          {...props}
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
