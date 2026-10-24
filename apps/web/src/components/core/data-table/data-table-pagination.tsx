'use client';

import * as React from 'react';
import type { RowData } from '@tanstack/react-table';
import { PaginationControls } from '@/components/core/pagination';
import { useCurrentLocale } from '@/components/providers/client-locale-provider';
import { dataTableCopy } from './constants';
import type { DataTableInstance } from './data-table';

export interface DataTablePaginationProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  pageSizeOptions?: number[];
  showPageSizeChanger?: boolean;
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageSizeChanger = true,
}: DataTablePaginationProps<TData>) {
  const locale = useCurrentLocale();
  const copy = dataTableCopy[locale];
  const pagination = table.state.pagination;
  const pageSize = pagination?.pageSize ?? 10;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageCount = table.getPageCount();
  const total = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 text-xs text-ash">
        {total} {copy.rows}
      </div>
      <PaginationControls
        className="sm:justify-end"
        pagination={{
          current: pageIndex + 1,
          pageSize,
          total,
          totalPages: pageCount,
        }}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger={showPageSizeChanger}
        pageSizeLabel={copy.rowsPerPage}
        maxPageButtons={5}
        labels={{
          firstPage: copy.firstPage,
          previousPage: copy.previousPage,
          nextPage: copy.nextPage,
          lastPage: copy.lastPage,
        }}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  );
}
