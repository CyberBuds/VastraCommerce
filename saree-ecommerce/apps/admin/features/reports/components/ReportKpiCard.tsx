'use client';

import * as React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ReportKpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: number; // percentage change, e.g. +14.2 or -3.5
  changeLabel?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  badgeText?: string;
}

export function ReportKpiCard({
  title,
  value,
  subtext,
  change,
  changeLabel = 'vs prev period',
  icon: Icon,
  iconColorClass = 'text-indigo-500 bg-indigo-500/10',
  badgeText,
}: ReportKpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3 relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{title}</span>
        <div className={`p-2 rounded-xl ${iconColorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
          {value}
        </div>

        <div className="flex items-center justify-between mt-1">
          {change !== undefined ? (
            <div className="flex items-center gap-1">
              <span
                className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  isPositive
                    ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400'
                    : isNegative
                    ? 'text-rose-700 bg-rose-500/10 dark:text-rose-400'
                    : 'text-slate-600 bg-slate-100 dark:text-zinc-400 dark:bg-zinc-800'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : isNegative ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {change > 0 ? `+${change}%` : `${change}%`}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">{changeLabel}</span>
            </div>
          ) : subtext ? (
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">{subtext}</span>
          ) : null}

          {badgeText && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 uppercase font-mono">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
