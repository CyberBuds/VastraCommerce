import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isOpen?: boolean
  onClose?: () => void
  title?: string
  size?: string
}

const DialogContext = React.createContext<{
  isOpen: boolean
  setOpen: (value: boolean) => void
}>({
  isOpen: false,
  setOpen: () => {},
})

export function Dialog({ children, open: controlledOpen, onOpenChange, isOpen: legacyIsOpen, onClose: legacyOnClose, title: legacyTitle }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined || legacyIsOpen !== undefined
  const isOpen = legacyIsOpen !== undefined ? legacyIsOpen : (isControlled ? controlledOpen : uncontrolledOpen)

  const setOpen = React.useCallback((value: boolean) => {
    if (legacyOnClose && !value) {
      legacyOnClose()
    }
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }, [isControlled, onOpenChange, legacyOnClose])

  if (legacyIsOpen !== undefined || legacyTitle !== undefined) {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
        <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-850">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">{legacyTitle}</h3>
            {legacyOnClose && (
              <button onClick={legacyOnClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                ✕
              </button>
            )}
          </div>
          <div className="mt-4 flex-1">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <DialogContext.Provider value={{ isOpen: !!isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen } = React.useContext(DialogContext)
  return (
    <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
      {children}
    </div>
  )
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, setOpen } = React.useContext(DialogContext)
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className={cn("relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800", className)}>
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-zinc-100", className)}>{children}</h2>
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-slate-500 dark:text-zinc-400", className)}>{children}</p>
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)}>{children}</div>
}
