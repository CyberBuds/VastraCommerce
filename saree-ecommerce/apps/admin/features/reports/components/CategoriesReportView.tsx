'use client';

import * as React from 'react';
import { useSalesByCategory } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportChartCard } from './ReportChartCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Layers, TrendingUp, PieChart as PieIcon, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function CategoriesReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: categories = [] } = useSalesByCategory();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Category & Sub-Category Performance"
        description="Merchandise taxonomy analytics, category revenue share, and growth metrics across departments."
        breadcrumbs={[{ label: 'Category Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Total Merchandise Categories" value="24" icon={Layers} />
        <ReportKpiCard title="Top Revenue Category" value="Avionics & Radar" subtext="39.4% revenue share" icon={TrendingUp} />
        <ReportKpiCard title="Fastest Growing Category" value="Turbine Propulsion" change={22.4} icon={PieIcon} />
        <ReportKpiCard title="Avg Units Sold per Category" value="3,820" change={6.8} icon={DollarSign} />
      </div>

      <ReportChartCard title="Category Revenue Breakdown ($)" subtitle="Net revenue volume by department">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categories}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="totalRevenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ReportChartCard>

      <ReportDataTable
        title="Category Performance Ledger"
        data={categories}
        columns={[
          { header: 'Category Name', accessorKey: 'name' },
          { header: 'Department', accessorKey: 'category' },
          { header: 'Orders Volume', accessorKey: 'ordersCount' },
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
