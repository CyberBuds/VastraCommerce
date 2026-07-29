import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterKeys?: string[]
}

export function DataTableToolbar<TData>({ table, filterKeys = [] }: DataTableToolbarProps<TData>) {
  const [value, setValue] = React.useState("")
  const primaryKey = filterKeys[0]

  return (
    <div className="flex items-center justify-between gap-4 p-1">
      <div className="flex flex-1 items-center space-x-2">
        {primaryKey && (
          <Input
            placeholder={`Filter ${primaryKey}...`}
            value={(table.getColumn(primaryKey)?.getFilterValue() as string) ?? value}
            onChange={(event) => {
              setValue(event.target.value)
              table.getColumn(primaryKey)?.setFilterValue(event.target.value)
            }}
            className="h-8 w-[150px] lg:w-[250px] text-xs"
          />
        )}
      </div>
    </div>
  )
}
