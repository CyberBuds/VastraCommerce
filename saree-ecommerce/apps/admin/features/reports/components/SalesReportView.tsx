'use client';

import * as React from 'react';
import { useSalesTrend, useSalesByCategory } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportChartCard } from './ReportChartCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { DollarSign, TrendingUp, Tag, Globe, ShoppingBag } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function SalesReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [periodTab, setPeriodTab] = React.useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');

  const { data: salesTrend = [] } = useSalesTrend();
  const { data: categories = [] } = useSalesByCategory();

  const totalGross = salesTrend.reduce((acc, curr) => acc + curr.grossSales, 0);
  const totalNet = salesTrend.reduce((acc, curr) => acc + curr.netSales, 0);
  const totalOrders = salesTrend.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Comprehensive Sales & Revenue Analytics"
        description="Deep-dive sales reports categorized by temporal periods, merchandise brands, regional outlets, and buyer profiles."
        breadcrumbs={[{ label: 'Sales Report' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      {/* Period Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 w-fit">
        {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriodTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              periodTab === tab
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Gross Sales Volume" value={`$${totalGross.toLocaleString()}`} change={11.5} icon={DollarSign} />
        <ReportKpiCard title="Net Revenue Realized" value={`$${totalNet.toLocaleString()}`} change={14.2} icon={TrendingUp} />
        <ReportKpiCard title="Total Orders Executed" value={totalOrders.toLocaleString()} change={8.9} icon={ShoppingBag} />
        <ReportKpiCard title="Average Gross Margin" value="38.4%" change={1.2} icon={Tag} />
      </div>

      {/* Sales Visual Chart */}
      <ReportChartCard title={`Sales Performance Trend (${periodTab.toUpperCase()})`} subtitle="Gross Sales vs Net Revenue">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
            />
            <Bar dataKey="grossSales" name="Gross Sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="netSales" name="Net Sales" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ReportChartCard>

      {/* Sales By Category Data Table */}
      <ReportDataTable
        title="Sales Breakdown by Category & Product Line"
        data={categories}
        columns={[
          { header: 'Category Name', accessorKey: 'name' },
          { header: 'Super Category', accessorKey: 'category' },
          { header: 'Orders Count', accessorKey: 'ordersCount' },
          { header: 'Units Sold', accessorKey: 'quantitySold' },
          {
            header: 'Total Revenue',
            accessorKey: (row) => <span className="font-mono font-bold">${row.totalRevenue.toLocaleString()}</span>,
          },
          {
            header: 'Revenue Share',
            accessorKey: (row) => <span className="font-bold text-indigo-600">{row.percentageOfTotal}%</span>,
          },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
