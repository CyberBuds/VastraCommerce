'use client';

import * as React from 'react';
import { useCustomerAnalytics } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Users, UserPlus, UserCheck, RefreshCcw, DollarSign } from 'lucide-react';

export function CustomersReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: cust } = useCustomerAnalytics();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Customer Intelligence & LTV Cohort Analytics"
        description="Comprehensive evaluation of customer acquisition, retention cohorts, repeat purchases, and enterprise lifetime value."
        breadcrumbs={[{ label: 'Customer Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ReportKpiCard title="Total Customers" value={(cust?.totalCustomers || 0).toLocaleString()} change={8.4} icon={Users} />
        <ReportKpiCard title="New Acquisitions" value={(cust?.newCustomers || 0).toLocaleString()} change={12.1} icon={UserPlus} />
        <ReportKpiCard title="Active Buyers" value={(cust?.activeCustomers || 0).toLocaleString()} icon={UserCheck} />
        <ReportKpiCard title="Repeat Buyers" value={(cust?.repeatCustomers || 0).toLocaleString()} change={6.2} icon={RefreshCcw} />
        <ReportKpiCard title="Average CLV" value={`$${(cust?.averageLtv || 0).toLocaleString()}`} change={4.5} icon={DollarSign} />
      </div>

      <ReportDataTable
        title="Top VIP Accounts by Total Revenue & LTV"
        data={cust?.topCustomers || []}
        columns={[
          { header: 'Account Name', accessorKey: 'name' },
          { header: 'Contact Email', accessorKey: 'email' },
          { header: 'Lifetime Orders', accessorKey: 'totalOrders' },
          {
            header: 'Total Expenditure',
            accessorKey: (r) => <span className="font-mono font-bold">${r.totalSpent.toLocaleString()}</span>,
          },
          {
            header: 'Estimated CLV',
            accessorKey: (r) => <span className="font-mono font-bold text-emerald-600">${r.ltv.toLocaleString()}</span>,
          },
          { header: 'Last Order Date', accessorKey: 'lastOrderDate' },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
