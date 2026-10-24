'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type ReactTable,
  type RowData,
  useTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/core/table';
import { useCurrentLocale } from '@/components/providers/client-locale-provider';
import { dataTableCopy } from './constants';
import { features, type DataTableFeatures } from './data-table-features';

export type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>;

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  className?: string;
  emptyMessage?: string;
  ariaLabel?: string;
  toolbar?: (table: DataTableInstance<TData>) => React.ReactNode;
  footer?: (table: DataTableInstance<TData>) => React.ReactNode;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  className,
  emptyMessage,
  ariaLabel,
  toolbar,
  footer,
}: DataTableProps<TData>) {
  const locale = useCurrentLocale();
  const copy = dataTableCopy[locale];
  const table = useTable({
    features,
    data,
    columns,
  });

  return (
    <div className={className}>
      {toolbar && <div className="mb-3">{toolbar(table)}</div>}
      <div className="overflow-hidden rounded-sm border border-gunmetal/60 bg-obsidian">
        <Table aria-label={ariaLabel}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Math.max(table.getVisibleLeafColumns().length, 1)}
                  className="h-24 text-center text-ash"
                >
                  {emptyMessage ?? copy.empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {footer && <div className="mt-3">{footer(table)}</div>}
    </div>
  );
}
