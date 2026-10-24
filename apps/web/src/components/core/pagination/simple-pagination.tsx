'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/core/input';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import type { PaginationInfo } from './types';

interface SimplePaginationProps {
  className?: string;
  disabled?: boolean;
  showTotal?: boolean;
  pagination: PaginationInfo;
  sizeClasses: string;
  buttonSize: 'sm' | 'default';
  getTotalText: () => string;
  onPageChange: (page: number) => void;
}

export function SimplePagination({
  className,
  disabled = false,
  showTotal = false,
  pagination,
  sizeClasses,
  buttonSize,
  getTotalText,
  onPageChange,
}: SimplePaginationProps) {
  const { current, totalPages } = pagination;

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        sizeClasses,
        className,
      )}
    >
      {showTotal && (
        <div className="text-muted-foreground">{getTotalText()}</div>
      )}

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(current - 1)}
          disabled={disabled || current <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="flex items-center gap-1 px-2">
          <Input
            type="number"
            value={current}
            onChange={(e) => {
              const page = parseInt(e.target.value, 10);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-16 text-center"
            min={1}
            max={totalPages}
            disabled={disabled}
          />
          <span className="text-ash/70">/ {totalPages}</span>
        </span>

        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(current + 1)}
          disabled={disabled || current >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
