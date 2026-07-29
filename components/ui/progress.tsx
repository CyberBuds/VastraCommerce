import * as React from "react"
import { cn } from "@/lib/utils"

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800", className)}>
      <div
        className="h-full w-full flex-1 bg-slate-900 transition-all dark:bg-zinc-100"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}
