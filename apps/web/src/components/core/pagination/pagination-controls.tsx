'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/core/select';
import { Input } from '@/components/core/input';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import { SimplePagination } from './simple-pagination';
import { PaginationPageList } from './pagination-page-list';
import type { PaginationControlsProps } from './types';

const defaultLabels = {
  firstPage: 'Go to first page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  lastPage: 'Go to last page',
  jumpPrevious: 'Jump back five pages',
  jumpNext: 'Jump forward five pages',
};

export function PaginationControls({
  className,
  pagination,
  itemRender,
  onPageChange,
  simple = false,
  size = 'default',
  onPageSizeChange,
  disabled = false,
  showTotal = false,
  maxPageButtons = 7,
  showLessItems = false,
  showSizeChanger = false,
  showQuickJumper = false,
  hideOnSinglePage = false,
  showPrevNextJumpers = true,
  pageSizeOptions = [10, 20, 50, 100],
  pageSizeLabel,
  labels,
}: PaginationControlsProps) {
  const [jumpPage, setJumpPage] = useState('');

  const { current, pageSize, total, totalPages } = pagination;
  const paginationLabels = { ...defaultLabels, ...labels };

  const sizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
  };

  const buttonSizes = useMemo(
    () => ({
      small: 'sm' as const,
      default: 'sm' as const,
      large: 'default' as const,
    }),
    [],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === current || disabled) return;
      onPageChange(page);
    },
    [current, totalPages, onPageChange, disabled],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: string) => {
      const parsedSize = parseInt(newPageSize, 10);
      if (parsedSize === pageSize || disabled) return;

      const newCurrentPage =
        Math.ceil(((current - 1) * pageSize) / parsedSize) + 1;
      onPageSizeChange(parsedSize);

      if (
        newCurrentPage !== current &&
        newCurrentPage <= Math.ceil(total / parsedSize)
      ) {
        onPageChange(newCurrentPage);
      }
    },
    [pageSize, current, total, onPageSizeChange, onPageChange, disabled],
  );

  const handleQuickJump = useCallback(() => {
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpPage('');
    }
  }, [jumpPage, totalPages, handlePageChange]);

  const handleJumpKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleQuickJump();
      }
    },
    [handleQuickJump],
  );

  const getTotalText = useCallback(() => {
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);

    if (total === 0) {
      return 'No items';
    }

    return `Showing ${start.toLocaleString()}-${end.toLocaleString()} of ${total.toLocaleString()}`;
  }, [current, pageSize, total]);

  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  if (simple) {
    return (
      <SimplePagination
        className={className}
        disabled={disabled}
        showTotal={showTotal}
        pagination={pagination}
        sizeClasses={sizeClasses[size]}
        buttonSize={buttonSizes[size]}
        getTotalText={getTotalText}
        onPageChange={handlePageChange}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center',
        sizeClasses[size],
        className,
      )}
    >
      {showTotal && <div className="text-ash/70">{getTotalText()}</div>}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <PaginationPageList
          current={current}
          totalPages={totalPages}
          disabled={disabled}
          size={size}
          buttonSizes={buttonSizes}
          showLessItems={showLessItems}
          showPrevNextJumpers={showPrevNextJumpers}
          maxPageButtons={maxPageButtons}
          itemRender={itemRender}
          labels={paginationLabels}
          onPageChange={handlePageChange}
        />

        {showSizeChanger && (
          <div className="flex items-center gap-2">
            {pageSizeLabel && (
              <span className="whitespace-nowrap text-ash/70">
                {pageSizeLabel}
              </span>
            )}
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showQuickJumper && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted-foreground">
              Go to
            </span>
            <Input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={handleJumpKeyDown}
              placeholder="Page"
              className="w-20"
              min={1}
              max={totalPages}
              disabled={disabled}
            />
            <Button
              variant="outline"
              size={buttonSizes[size]}
              onClick={handleQuickJump}
              disabled={
                disabled ||
                !jumpPage ||
                parseInt(jumpPage, 10) < 1 ||
                parseInt(jumpPage, 10) > totalPages
              }
            >
              Go
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
