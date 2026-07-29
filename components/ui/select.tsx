import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<{
  value?: string
  setValue: (value: string) => void
}>({
  value: "",
  setValue: () => {},
})

export function Select({ children, value: controlledValue, defaultValue, onValueChange }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "")
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const setValue = React.useCallback((val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val)
    }
    onValueChange?.(val)
  }, [isControlled, onValueChange])

  return (
    <SelectContext.Provider value={{ value, setValue }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100", className)}>
      {children}
    </div>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

export function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { setValue } = React.useContext(SelectContext)
  
  return (
    <select
      className={cn("absolute inset-0 w-full h-full opacity-0 cursor-pointer", className)}
      onChange={(e) => setValue(e.target.value)}
    >
      {children}
    </select>
  )
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}
