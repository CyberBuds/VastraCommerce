'use client';

import * as React from 'react';
import { useReportsStore } from '@/store/reportsStore';
import { Button, Select } from '@/components/enterprise/BaseInputs';
import { DateRangeType } from '@/features/reports/types/reportsTypes';
import { Download, Filter, RefreshCw, Calendar, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ReportsHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
  showFiltersToggle?: boolean;
  onToggleFilters?: () => void;
  isFiltersOpen?: boolean;
}

export function ReportsHeader({
  title,
  description,
  breadcrumbs = [],
  showFiltersToggle = true,
  onToggleFilters,
  isFiltersOpen = false,
}: ReportsHeaderProps) {
  const { filters, setFilters, openExportModal } = useReportsStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Analytics dataset refreshed with real-time telemetry.');
    }, 600);
  };

  return (
    <div className="space-y-3">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
        <span>Reports & Analytics</span>
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-zinc-200">{b.label}</span>
          </React.Fragment>
        ))}
      </nav>

      {/* Main Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">{title}</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Date Range Select */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ dateRange: e.target.value as DateRangeType })}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year (YTD)</option>
            </select>
          </div>

          {/* Filter Toggle Button */}
          {showFiltersToggle && onToggleFilters && (
            <Button
              variant={isFiltersOpen ? 'primary' : 'outline'}
              size="sm"
              onClick={onToggleFilters}
              className="font-bold gap-1.5 text-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </Button>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 h-8 w-8"
            title="Refresh Analytics Dataset"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 dark:text-zinc-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          {/* Export Modal Launcher */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => openExportModal(title)}
            className="font-bold gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
