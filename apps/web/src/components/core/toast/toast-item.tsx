'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const remainingRef = useRef(totalDuration as number);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(
      () => toast.dismiss(t.id),
      remainingRef.current,
    );

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = remainingRef.current - elapsed;
      setProgress(Math.max(0, (remaining / (totalDuration as number)) * 100));
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [t.id, totalDuration]);

  const pauseTimer = useCallback(() => {
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (Date.now() - startTimeRef.current),
    );
    clearTimeout(timeoutRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const resumeTimer = useCallback(() => startTimer(), [startTimer]);

  useEffect(() => {
    if (isInfinite) return;
    startTimer();
    return () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isInfinite, startTimer]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
      onMouseEnter={isInfinite ? undefined : pauseTimer}
      onMouseLeave={isInfinite ? undefined : resumeTimer}
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
            'absolute bottom-0 left-0 h-[3px]',
            getProgressColor(t.type),
          )}
          style={{ width: `${progress}%` }}
        />
      )}
    </motion.div>
  );
}
