import * as React from "react"

export function DataTableRowActions({ children }: { children?: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-xs font-medium">{children}</div>
}
