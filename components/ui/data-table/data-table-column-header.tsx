import * as React from "react"
import { Column } from "@tanstack/react-table"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className="text-xs font-semibold">{title}</div>
  }

  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center gap-1 text-xs font-semibold hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer"
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? " ↓" : column.getIsSorted() === "asc" ? " ↑" : ""}
    </button>
  )
}
