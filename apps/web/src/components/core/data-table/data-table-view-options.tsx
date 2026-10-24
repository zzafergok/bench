'use client';

import * as React from 'react';
import type { RowData } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/core/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/core/dropdown-menu';
import { useCurrentLocale } from '@/components/providers/client-locale-provider';
import { dataTableCopy } from './constants';
import type { DataTableInstance } from './data-table';

export interface DataTableViewOptionsProps<TData extends RowData> {
  table: DataTableInstance<TData>;
}

export function DataTableViewOptions<TData extends RowData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const locale = useCurrentLocale();
  const copy = dataTableCopy[locale];
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    );

  if (!columns.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 text-xs">
          <Settings2 className="mr-2 size-3.5" />
          {copy.columns}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{copy.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="text-xs capitalize"
              checked={column.getIsVisible()}
              disabled={
                column.getIsVisible() &&
                table.getVisibleLeafColumns().length === 1
              }
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xs"
          onClick={() => table.resetColumnVisibility()}
        >
          {copy.resetColumns}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
