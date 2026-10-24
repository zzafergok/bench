'use client';

import { useState, useCallback } from 'react';
import type { PaginationInfo } from './types';

export function usePagination(initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const getPaginationInfo = useCallback(
    (total: number): PaginationInfo => {
      const totalPages = Math.ceil(total / pageSize);
      return {
        current: currentPage,
        pageSize,
        total,
        totalPages,
      };
    },
    [currentPage, pageSize],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page: number, total: number) => {
      const totalPages = Math.ceil(total / pageSize);
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [pageSize],
  );

  return {
    currentPage,
    pageSize,
    getPaginationInfo,
    handlePageChange,
    handlePageSizeChange,
    reset,
    goToPage,
  };
}
