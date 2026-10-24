'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import type { PaginationControlsProps, PaginationLabels } from './types';

interface PaginationPageListProps {
  current: number;
  totalPages: number;
  disabled: boolean;
  size: 'small' | 'default' | 'large';
  buttonSizes: Record<'small' | 'default' | 'large', 'sm' | 'default'>;
  showLessItems: boolean;
  showPrevNextJumpers: boolean;
  maxPageButtons: number;
  itemRender?: PaginationControlsProps['itemRender'];
  labels: PaginationLabels;
  onPageChange: (page: number) => void;
}

export function PaginationPageList({
  current,
  totalPages,
  disabled,
  size,
  buttonSizes,
  showLessItems,
  showPrevNextJumpers,
  maxPageButtons,
  itemRender,
  labels,
  onPageChange,
}: PaginationPageListProps) {
  // Görünür sayfa numaralarını hesapla
  const getVisiblePages = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = Math.floor((maxPageButtons - 1) / 2);
    let start = Math.max(1, current - delta);
    const end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const renderPageButton = (page: number, isActive: boolean = false) => {
    const buttonElement = (
      <Button
        key={page}
        variant={isActive ? 'default' : 'outline'}
        size={buttonSizes[size]}
        onClick={() => onPageChange(page)}
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
        className={cn('min-w-9', isActive && 'pointer-events-none')}
      >
        {page}
      </Button>
    );

    if (itemRender) {
      return itemRender(page, buttonElement, 'page');
    }

    return buttonElement;
  };

  const renderEllipsis = (key: string, direction: 'prev' | 'next') => {
    const jumpPages =
      direction === 'prev'
        ? Math.max(1, current - 5)
        : Math.min(totalPages, current + 5);

    const buttonElement = (
      <Button
        key={key}
        variant="outline"
        size={buttonSizes[size]}
        onClick={() => onPageChange(jumpPages)}
        disabled={disabled}
        className="min-w-9"
        aria-label={
          direction === 'prev' ? labels.jumpPrevious : labels.jumpNext
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );

    if (itemRender) {
      return itemRender(
        jumpPages,
        buttonElement,
        direction === 'prev' ? 'jump-prev' : 'jump-next',
      );
    }

    return buttonElement;
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  return (
    <div className="flex items-center gap-1">
      {showPrevNextJumpers && (
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => onPageChange(1)}
          disabled={disabled || current <= 1}
          className="min-w-9"
          aria-label={labels.firstPage}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size={buttonSizes[size]}
        onClick={() => onPageChange(current - 1)}
        disabled={disabled || current <= 1}
        className="min-w-9"
        aria-label={labels.previousPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showLeftEllipsis && !showLessItems && (
        <>
          {renderPageButton(1)}
          {visiblePages[0] > 2 && renderEllipsis('left-ellipsis', 'prev')}
        </>
      )}

      {visiblePages.map((page) => renderPageButton(page, page === current))}

      {showRightEllipsis && !showLessItems && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 &&
            renderEllipsis('right-ellipsis', 'next')}
          {renderPageButton(totalPages)}
        </>
      )}

      <Button
        variant="outline"
        size={buttonSizes[size]}
        onClick={() => onPageChange(current + 1)}
        disabled={disabled || current >= totalPages}
        className="min-w-9"
        aria-label={labels.nextPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {showPrevNextJumpers && (
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || current >= totalPages}
          className="min-w-9"
          aria-label={labels.lastPage}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
