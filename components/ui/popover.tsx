import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
  children: React.ReactNode
}

const PopoverContext = React.createContext<{
  open: boolean
  setOpen: (value: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

export function Popover({ children }: PopoverProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { open, setOpen } = React.useContext(PopoverContext)
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer w-full">
      {children}
    </div>
  )
}

export function PopoverContent({ children, className, align = "center" }: { children: React.ReactNode; className?: string; align?: string }) {
  const { open, setOpen } = React.useContext(PopoverContext)
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className={cn("absolute z-50 mt-1 w-auto rounded-md border border-slate-200 bg-white p-4 shadow-md dark:border-zinc-800 dark:bg-zinc-900", className)}>
        {children}
      </div>
    </>
  )
}
