'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Info, Loader2, X } from 'lucide-react';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import type { Toast, ToastType } from '@/types';
import { toast } from './toast-observer';

const ToastIcon = ({ type }: { type?: ToastType }) => {
  switch (type) {
    case 'success':
      return <Check className="h-4 w-4 text-signal-green" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-alert-red" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'loading':
      return <Loader2 className="h-4 w-4 animate-spin text-ash" />;
    default:
      return <Info className="h-4 w-4 text-tulpar-blue" />;
  }
};

const getProgressColor = (type?: ToastType): string => {
  switch (type) {
    case 'success':
      return 'bg-signal-green';
    case 'error':
      return 'bg-alert-red';
    case 'warning':
      return 'bg-amber-500';
    default:
      return 'bg-tulpar-blue';
  }
};

export function ToastItem({ t }: { t: Toast }) {
  const totalDuration = t.duration ?? 4000;
  const isInfinite = !isFinite(totalDuration as number);

  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(totalDuration as number);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isInfinite || isPaused) return;

    startTimeRef.current = Date.now();
    const timerId = setTimeout(() => toast.dismiss(t.id), remainingRef.current);

    let rafId: number;
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = remainingRef.current - elapsed;
      setProgress(Math.max(0, (remaining / (totalDuration as number)) * 100));
      if (remaining > 0) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startTimeRef.current),
      );
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [isInfinite, isPaused, t.id, totalDuration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
      onMouseEnter={isInfinite ? undefined : () => setIsPaused(true)}
      onMouseLeave={isInfinite ? undefined : () => setIsPaused(false)}
      className={cn(
        'layout-group pointer-events-auto relative w-full overflow-hidden',
        'rounded-xl border border-gunmetal/30 bg-obsidian p-4 shadow-2xl shadow-void-black/50',
        'flex items-start gap-3 backdrop-blur-xl',
      )}
    >
      <div className="mt-0.5 shrink-0">
        <ToastIcon type={t.type} />
      </div>
      <div className="flex-1 space-y-1">
        {t.title && (
          <p className="text-sm font-medium text-titanium">{t.title}</p>
        )}
        {t.description && <p className="text-xs text-ash">{t.description}</p>}
        {t.action && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                t.action?.onClick();
                toast.dismiss(t.id);
              }}
              className="h-7 w-max rounded-md border-white/10 bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15 active:scale-95"
            >
              {t.action.label}
            </Button>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toast.dismiss(t.id)}
        className="mt-0.5 h-6 w-6 rounded-md p-1 text-ash hover:bg-gunmetal/20 hover:text-titanium"
        aria-label="Bildirimi kapat"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      {!isInfinite && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-0.75',
            getProgressColor(t.type),
          )}
          style={{ width: `${progress}%` }}
        />
      )}
    </motion.div>
  );
}
