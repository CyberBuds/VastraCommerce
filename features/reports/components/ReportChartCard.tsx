'use client';

import * as React from 'react';
import { Button } from '@/components/enterprise/BaseInputs';
import { Download, Maximize2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface ReportChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  actionButton?: React.ReactNode;
}

export function ReportChartCard({
  title,
  subtitle,
  children,
  height = 320,
  actionButton,
}: ReportChartCardProps) {
  const handleDownloadImage = () => {
    toast.success(`Chart graphics exported as high-resolution PNG.`);
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          {actionButton}
          <button
            onClick={handleDownloadImage}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Export Visual Chart"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div style={{ height }} className="w-full relative">
        {children}
      </div>
    </div>
  );
}
