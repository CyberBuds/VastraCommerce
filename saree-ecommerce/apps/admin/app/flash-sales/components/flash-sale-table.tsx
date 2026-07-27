// app/flash-sales/components/flash-sale-table.tsx
'use client';

import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useGetFlashSales } from '@/features/marketing/hooks/useFlashSales';
import { DataTable, DataTableToolbar, DataTablePagination } from '@/components/enterprise/EnterpriseTable';
import { columns } from '../columns';

export function FlashSalesTable() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const { data, isLoading, isError } = useGetFlashSales({
      // pass filters here
  });

  const tableData = data?.data || [];
  const pageCount = data?.meta?.lastPage || 0;

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} filterKeys={['name', 'status']} />
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} isLoading={isLoading} isError={isError} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
