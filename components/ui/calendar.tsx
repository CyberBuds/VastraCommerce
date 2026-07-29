import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  initialFocus?: boolean
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [val, setVal] = React.useState<string>(
    selected ? selected.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setVal(v)
    if (v) {
      onSelect?.(new Date(v))
    } else {
      onSelect?.(undefined)
    }
  }

  return (
    <div className={cn("p-2", className)}>
      <input
        type="date"
        value={val}
        onChange={handleChange}
        className="block w-full rounded-md border border-slate-300 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
    </div>
  )
}
