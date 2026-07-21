'use client';

import * as React from 'react';
import { AnalyticsCharts } from '@/features/customer/components/AnalyticsCharts';
import { BarChart3 } from 'lucide-react';

export default function CustomerReportsPage() {
  return (
    <div className="space-y-6" id="customer-reports-page-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5.5 h-5.5 text-slate-800" />
            CRM Metrics & Customer Reports
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Analytical insights on acquisition trends, support caseloads, wallet assets, and user distribution.
          </p>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
}
