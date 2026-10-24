'use client';

import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      title={message}
      className={cn(
        'mt-1 flex items-center gap-1.5 truncate whitespace-nowrap text-compact font-medium text-alert-red',
        className,
      )}
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0 text-alert-red" />
      <span className="truncate">{message}</span>
    </div>
  );
}
