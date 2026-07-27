import { useState, useCallback } from 'react';
import { PaginationParams, SortParams } from '@/types/common';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSort?: SortParams;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: options.initialPage || 1,
    limit: options.initialLimit || 10,
  });

  const [sort, setSort] = useState<SortParams | undefined>(options.initialSort);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page on size limit change
  }, []);

  const handleSort = useCallback((column: string) => {
    setSort((prev) => {
      if (prev?.column === column) {
        if (prev.direction === 'asc') {
          return { column, direction: 'desc' };
        }
        return undefined; // clear sort on 3rd click
      }
      return { column, direction: 'asc' };
    });
  }, []);

  const reset = useCallback(() => {
    setPagination({ page: 1, limit: options.initialLimit || 10 });
    setSort(options.initialSort);
  }, [options.initialLimit, options.initialSort]);

  return {
    page: pagination.page,
    limit: pagination.limit,
    sort,
    setPage,
    setLimit,
    setSort,
    handleSort,
    reset,
  };
}
