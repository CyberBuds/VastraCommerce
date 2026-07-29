import * as React from "react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  value?: File[]
  onValueChange?: (files: File[]) => void
  maxFiles?: number
  className?: string
}

export function FileUploader({ value = [], onValueChange, maxFiles = 1, className }: FileUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, maxFiles)
      onValueChange?.(selectedFiles)
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-lg p-6 bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer relative", className)}>
      <input
        type="file"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
          {value.length > 0 ? `${value.length} file(s) selected` : "Click or drag & drop to upload"}
        </p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
      </div>
    </div>
  )
}
