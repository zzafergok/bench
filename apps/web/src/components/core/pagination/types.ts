import React from 'react';

export interface PaginationInfo {
  total: number;
  current: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationLabels {
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  jumpPrevious: string;
  jumpNext: string;
}

export interface PaginationControlsProps {
  simple?: boolean;
  disabled?: boolean;
  className?: string;
  showTotal?: boolean;
  maxPageButtons?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pagination: PaginationInfo;
  pageSizeOptions?: number[];
  hideOnSinglePage?: boolean;
  showPrevNextJumpers?: boolean;
  onPageChange: (page: number) => void;
  size?: 'small' | 'default' | 'large';
  onPageSizeChange: (pageSize: number) => void;
  itemRender?: (
    page: number,
    originalElement: React.ReactElement,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
  ) => React.ReactNode;
  showLessItems?: boolean;
  pageSizeLabel?: string;
  labels?: Partial<PaginationLabels>;
}

export interface AdvancedPaginationOptions<T> {
  data: T[];
  page: number;
  pageSize: number;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  searchText?: string;
  searchFields?: (keyof T)[];
}
