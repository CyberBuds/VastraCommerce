'use client';

import * as React from 'react';
import { useOrderStatusBreakdown } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportChartCard } from './ReportChartCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { ShoppingBag, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

export function OrdersReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: orderStatuses = [] } = useOrderStatusBreakdown();

  const totalOrders = orderStatuses.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Order Lifecycle & Fulfillment Analytics"
        description="Comprehensive monitoring of order throughput, processing velocity, cancellation rates, and return metrics."
        breadcrumbs={[{ label: 'Order Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Total Processed Orders" value={totalOrders.toLocaleString()} change={9.3} icon={ShoppingBag} />
        <ReportKpiCard title="Avg Warehouse Pick Time" value="1.4 Hours" change={-12.0} subtext="Faster fulfillment" icon={Clock} />
        <ReportKpiCard title="Order Completion Rate" value="96.4%" change={1.5} icon={CheckCircle2} />
        <ReportKpiCard title="Cancellation / Return Rate" value="3.6%" change={-0.4} icon={XCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReportChartCard title="Fulfillment Status Breakdown" subtitle="Distribution across lifecycle states">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatuses} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={85} innerRadius={50}>
                  {orderStatuses.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val} Orders`, '']} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ReportChartCard>
        </div>

        <div className="lg:col-span-2">
          <ReportDataTable
            title="Order Status Metrics Ledger"
            data={orderStatuses}
            columns={[
              { header: 'Status Name', accessorKey: 'status' },
              { header: 'Order Volume', accessorKey: 'count' },
              {
                header: 'Total Order Value',
                accessorKey: (row) => <span className="font-mono font-bold">${row.value.toLocaleString()}</span>,
              },
              {
                header: 'Percentage Share',
                accessorKey: (row) => <span className="font-bold text-indigo-600">{row.percentage}%</span>,
              },
            ]}
          />
        </div>
      </div>

      <ReportExportModal />
    </div>
  );
}
