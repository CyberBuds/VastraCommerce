'use client';

import * as React from 'react';
import {
  useExecutiveMetrics,
  useSalesTrend,
  useSalesByCategory,
  useOrderStatusBreakdown,
} from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportChartCard } from './ReportChartCard';
import { ReportExportModal } from './ReportExportModal';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Percent,
  RefreshCw,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ReportsDashboardView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: metrics } = useExecutiveMetrics();
  const { data: salesTrend = [] } = useSalesTrend();
  const { data: categories = [] } = useSalesByCategory();
  const { data: orderStatuses = [] } = useOrderStatusBreakdown();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Executive Intelligence Dashboard"
        description="Comprehensive real-time telemetry across revenue, order fulfillment, customers, and financial margins."
        breadcrumbs={[{ label: 'Executive Dashboard' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard
          title="Total Revenue"
          value={`$${((metrics?.totalRevenue || 0) / 1000).toFixed(1)}k`}
          change={metrics?.revenueChange}
          icon={DollarSign}
          iconColorClass="text-emerald-600 bg-emerald-500/10"
        />
        <ReportKpiCard
          title="Gross Sales"
          value={`$${((metrics?.grossSales || 0) / 1000).toFixed(1)}k`}
          subtext="Before refunds & promos"
          icon={TrendingUp}
          iconColorClass="text-indigo-600 bg-indigo-500/10"
        />
        <ReportKpiCard
          title="Total Orders"
          value={(metrics?.totalOrders || 0).toLocaleString()}
          change={metrics?.ordersChange}
          icon={ShoppingBag}
          iconColorClass="text-blue-600 bg-blue-500/10"
        />
        <ReportKpiCard
          title="Active Customers"
          value={(metrics?.totalCustomers || 0).toLocaleString()}
          change={4.2}
          icon={Users}
          iconColorClass="text-purple-600 bg-purple-500/10"
        />
        <ReportKpiCard
          title="Inventory Valuation"
          value={`$${((metrics?.inventoryValue || 0) / 1000000).toFixed(2)}M`}
          subtext="Warehouse cost basis"
          icon={Package}
          iconColorClass="text-amber-600 bg-amber-500/10"
        />
        <ReportKpiCard
          title="Average Order Value"
          value={`$${metrics?.averageOrderValue || 0}`}
          change={1.8}
          icon={BarChart3}
          iconColorClass="text-sky-600 bg-sky-500/10"
        />
        <ReportKpiCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate || 0}%`}
          change={metrics?.conversionChange}
          icon={Percent}
          iconColorClass="text-teal-600 bg-teal-500/10"
        />
        <ReportKpiCard
          title="Net Operating Profit"
          value={`$${((metrics?.netProfit || 0) / 1000).toFixed(1)}k`}
          change={12.4}
          badgeText="25.8% Margin"
          icon={DollarSign}
          iconColorClass="text-emerald-600 bg-emerald-500/10"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Revenue Trend (2 cols) */}
        <div className="lg:col-span-2">
          <ReportChartCard
            title="Monthly Sales & Net Revenue Trajectory"
            subtitle="Comparing Gross Sales vs Net Sales after discounts & refunds"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="grossSales" name="Gross Sales" stroke="#6366f1" fillOpacity={1} fill="url(#grossGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="netSales" name="Net Revenue" stroke="#10b981" fillOpacity={1} fill="url(#netGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ReportChartCard>
        </div>

        {/* Order Lifecycle Distribution (1 col) */}
        <div>
          <ReportChartCard
            title="Order Status Distribution"
            subtitle="Real-time breakdown of open vs completed orders"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatuses}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {orderStatuses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Orders`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ReportChartCard>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChartCard
          title="Revenue by Product Category"
          subtitle="Top aerospace categories ordered by net revenue volume"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.15} />
              <XAxis type="number" tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              />
              <Bar dataKey="totalRevenue" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* Category Share Table */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            Category Revenue Share Matrix
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {categories.map((cat) => (
              <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-zinc-100">{cat.name}</p>
                  <p className="text-[11px] text-slate-400">{cat.ordersCount} orders • {cat.quantitySold} units</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-zinc-100 font-mono">${cat.totalRevenue.toLocaleString()}</p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">{cat.percentageOfTotal}% share</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportExportModal />
    </div>
  );
}
