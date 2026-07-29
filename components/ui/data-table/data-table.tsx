import * as React from "react"
import { flexRender, Table as TableType } from "@tanstack/react-table"

interface DataTableProps<TData> {
  table: TableType<TData>
  columns: any[]
  isLoading?: boolean
  isError?: boolean
}

export function DataTable<TData>({ table, isLoading, isError }: DataTableProps<TData>) {
  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading records...</div>
  }

  if (isError) {
    return <div className="p-8 text-center text-sm text-red-500">Failed to load data.</div>
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 font-semibold text-xs text-slate-600 dark:text-zinc-400">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-xs text-slate-800 dark:text-zinc-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={table.getAllColumns().length} className="h-24 text-center text-xs text-slate-400">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
