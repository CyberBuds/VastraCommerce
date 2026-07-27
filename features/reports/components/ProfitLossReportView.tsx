'use client';

import * as React from 'react';
import { useFinanceSummary } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportExportModal } from './ReportExportModal';
import { DollarSign, TrendingUp, TrendingDown, Percent, FileSpreadsheet } from 'lucide-react';

export function ProfitLossReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: fin } = useFinanceSummary();

  const grossRev = fin?.grossRevenue || 2650000;
  const cogs = fin?.cogs || 1320000;
  const grossProfit = grossRev - cogs;
  const opEx = (fin?.operatingExpenses || 380000) + (fin?.marketingExpenses || 95000) + (fin?.logisticsExpenses || 110000);
  const netBeforeTax = grossProfit - opEx;
  const netIncome = netBeforeTax - (fin?.taxLiability || 223700);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Profit & Loss (P&L) Statement"
        description="Comprehensive income statement auditing gross revenue, cost of goods sold (COGS), operating overheads, and net EBITDA."
        breadcrumbs={[{ label: 'Profit & Loss' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Gross Sales Revenue" value={`$${grossRev.toLocaleString()}`} change={14.8} icon={DollarSign} />
        <ReportKpiCard title="Cost of Goods Sold (COGS)" value={`$${cogs.toLocaleString()}`} icon={TrendingDown} />
        <ReportKpiCard title="Gross Margin Profit" value={`$${grossProfit.toLocaleString()}`} change={16.2} icon={TrendingUp} />
        <ReportKpiCard title="Net Income After Tax" value={`$${netIncome.toLocaleString()}`} change={12.4} badgeText="20.1% Net Rate" icon={Percent} />
      </div>

      {/* P&L Structured Statement Table */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
            Income Statement (P&L Ledger)
          </h3>
          <span className="text-xs text-slate-500 font-mono">Q2 / YTD 2026</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
          {/* Revenue Section */}
          <div className="py-2.5 flex items-center justify-between font-bold text-slate-900 dark:text-zinc-100 bg-slate-50/50 dark:bg-zinc-950/50 px-3 rounded-lg">
            <span>GROSS SALES REVENUE</span>
            <span className="font-mono text-emerald-600">${grossRev.toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between pl-6 text-slate-600 dark:text-zinc-300">
            <span>Cost of Goods Sold (COGS)</span>
            <span className="font-mono text-rose-600">-${cogs.toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between font-bold text-slate-900 dark:text-zinc-100 bg-slate-100/60 dark:bg-zinc-800/60 px-3 rounded-lg">
            <span>GROSS PROFIT MARGIN</span>
            <span className="font-mono text-emerald-600">${grossProfit.toLocaleString()}</span>
          </div>

          {/* Operating Expenses */}
          <div className="py-2.5 flex items-center justify-between pl-6 text-slate-600 dark:text-zinc-300">
            <span>General & Administrative Operating Overhead</span>
            <span className="font-mono text-rose-600">-${(fin?.operatingExpenses || 380000).toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between pl-6 text-slate-600 dark:text-zinc-300">
            <span>Marketing & Customer Acquisition Spend</span>
            <span className="font-mono text-rose-600">-${(fin?.marketingExpenses || 95000).toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between pl-6 text-slate-600 dark:text-zinc-300">
            <span>Freight Freight & Logistics Overhead</span>
            <span className="font-mono text-rose-600">-${(fin?.logisticsExpenses || 110000).toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between font-bold text-slate-900 dark:text-zinc-100 bg-slate-100/60 dark:bg-zinc-800/60 px-3 rounded-lg">
            <span>OPERATING INCOME (EBITDA)</span>
            <span className="font-mono text-emerald-600">${netBeforeTax.toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between pl-6 text-slate-600 dark:text-zinc-300">
            <span>Estimated Income Tax Liability</span>
            <span className="font-mono text-rose-600">-${(fin?.taxLiability || 223700).toLocaleString()}</span>
          </div>

          <div className="py-3 flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-zinc-100 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 px-4 rounded-xl">
            <span>NET INCOME AFTER TAX</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">${netIncome.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <ReportExportModal />
    </div>
  );
}
