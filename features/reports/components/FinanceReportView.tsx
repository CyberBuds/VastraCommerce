'use client';

import * as React from 'react';
import { useFinanceSummary } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Landmark, FileText, CreditCard, DollarSign } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2026-001', accountName: 'Boeing Global Logistics', invoiceDate: '2026-07-01', dueDate: '2026-07-31', amount: 142000, status: 'PAID' },
  { id: 'INV-2026-002', accountName: 'Airbus Defense SE', invoiceDate: '2026-07-05', dueDate: '2026-08-05', amount: 98000, status: 'SENT' },
  { id: 'INV-2026-003', accountName: 'Lockheed Martin', invoiceDate: '2026-06-15', dueDate: '2026-07-15', amount: 65000, status: 'OVERDUE' },
];

export function FinanceReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: fin } = useFinanceSummary();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Financial Ledger, Invoices & Outstanding Balances"
        description="Accounts receivable auditing, outstanding invoice age breakdown, credit notes, and debit notes."
        breadcrumbs={[{ label: 'Finance Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Accounts Receivable" value="$305,000" change={5.1} icon={Landmark} />
        <ReportKpiCard title="Overdue Invoices" value="$65,000" subtext="Requires collections follow-up" icon={FileText} iconColorClass="text-rose-600 bg-rose-500/10" />
        <ReportKpiCard title="Issued Credit Notes" value="$12,400" icon={CreditCard} />
        <ReportKpiCard title="Avg Days Sales Outstanding (DSO)" value="24 Days" change={-2.0} icon={DollarSign} />
      </div>

      <ReportDataTable
        title="Corporate B2B Invoice Aging Ledger"
        data={mockInvoices}
        columns={[
          { header: 'Invoice Number', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.id}</span> },
          { header: 'Account Name', accessorKey: 'accountName' },
          { header: 'Invoice Date', accessorKey: 'invoiceDate' },
          { header: 'Due Date', accessorKey: 'dueDate' },
          { header: 'Amount Due', accessorKey: (r) => <span className="font-mono font-bold">${r.amount.toLocaleString()}</span> },
          {
            header: 'Status',
            accessorKey: (r) => (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                r.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                r.status === 'SENT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' :
                'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
              }`}>
                {r.status}
              </span>
            ),
          },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
