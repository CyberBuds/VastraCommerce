import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Download, EyeOff, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './BaseInputs';
import { downloadFile } from '@/utils/common';

interface EnterpriseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  isLoading?: boolean;
  onBulkDelete?: (rows: TData[]) => void;
  onBulkStatusChange?: (rows: TData[], status: string) => void;
  stickyLeftColumn?: boolean;
}

export function EnterpriseTable<TData>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  isLoading = false,
  onBulkDelete,
  onBulkStatusChange,
  stickyLeftColumn = true,
}: EnterpriseTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsColumnDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = table.getVisibleFlatColumns()
      .filter((col) => col.id !== 'select')
      .map((col) => col.id || col.columnDef.header?.toString() || '');

    const rows = table.getFilteredRowModel().rows.map((row) => {
      return table.getVisibleFlatColumns()
        .filter((col) => col.id !== 'select')
        .map((col) => {
          const val = row.getValue(col.id);
          return `"${String(val || '').replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadFile(csvContent, 'enterprise-export.csv', 'text/csv');
  };

  const handleExportExcel = () => {
    // Standard simulation of Tab-delimited Excel-readable document
    if (data.length === 0) return;
    const headers = table.getVisibleFlatColumns()
      .filter((col) => col.id !== 'select')
      .map((col) => col.id || col.columnDef.header?.toString() || '');

    const rows = table.getFilteredRowModel().rows.map((row) => {
      return table.getVisibleFlatColumns()
        .filter((col) => col.id !== 'select')
        .map((col) => row.getValue(col.id))
        .join('\t');
    });

    const excelContent = [headers.join('\t'), ...rows].join('\n');
    downloadFile(excelContent, 'enterprise-export.xls', 'application/vnd.ms-excel');
  };

  return (
    <div className="w-full space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Global search table..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-zinc-100 placeholder-slate-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 mr-2 border-r border-slate-200 dark:border-zinc-800 pr-3">
              <span className="text-xs font-semibold text-slate-500 mr-1">
                {selectedRows.length} selected
              </span>
              {onBulkStatusChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onBulkStatusChange(selectedRows, 'ACTIVE');
                    setRowSelection({});
                  }}
                >
                  Activate
                </Button>
              )}
              {onBulkDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onBulkDelete(selectedRows);
                    setRowSelection({});
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          )}

          {/* Export Selectors */}
          <Button variant="outline" size="sm" onClick={handleExportCSV} icon={Download} iconPosition="left">
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} icon={Download} iconPosition="left">
            Excel
          </Button>

          {/* Columns Visibility Filter */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              icon={EyeOff}
              iconPosition="left"
            >
              Columns
            </Button>
            {isColumnDropdownOpen && (
              <div className="absolute right-0 mt-1.5 z-40 w-44 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl py-1.5 text-xs text-slate-700 dark:text-zinc-300">
                <div className="px-3 py-1 font-bold border-b border-slate-100 dark:border-zinc-850 mb-1">
                  Toggle Columns
                </div>
                {table
                  .getAllLeafColumns()
                  .filter((col) => col.id !== 'select')
                  .map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={(e) => column.toggleVisibility(e.target.checked)}
                        className="rounded-sm border-slate-300 text-slate-800"
                      />
                      <span>{column.id}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structured Table Container */}
      <div className="w-full border border-slate-200 dark:border-zinc-850 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full border-collapse text-left text-sm relative">
            {/* Sticky Header */}
            <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-950 z-20 border-b border-slate-200 dark:border-zinc-850">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, colIdx) => {
                    const isFirstCol = colIdx === 0 && stickyLeftColumn;
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'py-3.5 px-4 font-semibold text-xs tracking-wider text-slate-500 dark:text-zinc-400 uppercase select-none',
                          {
                            'sticky left-0 bg-slate-50 dark:bg-zinc-950 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]': isFirstCol,
                          }
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                            className={cn('flex items-center gap-1', {
                              'cursor-pointer hover:text-slate-800 dark:hover:text-zinc-200': header.column.getCanSort(),
                            })}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="py-4 px-4">
                        <div className="h-4 bg-slate-100 dark:bg-zinc-850 animate-pulse rounded-md w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell, cellIdx) => {
                      const isFirstCell = cellIdx === 0 && stickyLeftColumn;
                      return (
                        <td
                          key={cell.id}
                          className={cn('py-3.5 px-4 text-slate-700 dark:text-zinc-300 font-medium', {
                            'sticky left-0 bg-white dark:bg-zinc-900 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]': isFirstCell,
                          })}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-slate-400 font-semibold text-xs">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-5 py-4 border-t border-slate-150 dark:border-zinc-850 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/10 dark:bg-zinc-950/5">
          <div>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} records
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Rows per page</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="bg-transparent border border-slate-200 dark:border-zinc-800 rounded-md py-1 px-1.5 focus:outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="p-1 h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-1 h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
