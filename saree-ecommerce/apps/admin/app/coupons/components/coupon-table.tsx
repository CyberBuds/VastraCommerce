// app/coupons/components/coupon-table.tsx
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

import { useGetCoupons } from '@/features/marketing/hooks/useCoupons';
import { useMarketingStore } from '@/store/marketingStore';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import { columns } from '../columns';
import { Coupon } from '@/types/marketing';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';

interface CouponsTableProps {
  //
}

export function CouponsTable({}: CouponsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const { setCouponFilters, setSelectedCoupons } = useMarketingStore();
  
  React.useEffect(() => {
    const filters = columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value;
      return acc;
    }, {} as Record<string, any>);
    setCouponFilters(filters);
  }, [columnFilters, setCouponFilters]);

  const { data, isLoading, isError } = useGetCoupons();
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

  React.useEffect(() => {
    const selected = Object.keys(rowSelection).map(idx => tableData[parseInt(idx)].id);
    setSelectedCoupons(selected);
  }, [rowSelection, setSelectedCoupons, tableData]);

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} filterKeys={['code', 'status']} />
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} isLoading={isLoading} isError={isError} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
