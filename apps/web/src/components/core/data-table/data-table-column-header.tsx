'use client';

import * as React from 'react';
import type { Column, RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/core/dropdown-menu';
import { useCurrentLocale } from '@/components/providers/client-locale-provider';
import { dataTableCopy } from './constants';
import type { DataTableFeatures } from './data-table-features';

export interface DataTableColumnHeaderProps<
  TData extends RowData,
  TValue = unknown,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData extends RowData, TValue = unknown>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const locale = useCurrentLocale();
  const copy = dataTableCopy[locale];
  if (!column.getCanSort()) {
    return (
      <div className={cn('text-xs font-medium text-ash', className)}>
        {title}
      </div>
    );
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs text-ash hover:text-white data-[state=open]:bg-gunmetal/30"
          >
            <span>{title}</span>
            {isSorted === 'desc' ? (
              <ArrowDown className="ml-2 size-3.5 text-tulpar-blue" />
            ) : isSorted === 'asc' ? (
              <ArrowUp className="ml-2 size-3.5 text-tulpar-blue" />
            ) : (
              <ChevronsUpDown className="ml-2 size-3.5 opacity-50" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 size-3.5 text-ash" />
            {copy.ascending}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 size-3.5 text-ash" />
            {copy.descending}
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 size-3.5 text-ash" />
                {copy.hide}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
