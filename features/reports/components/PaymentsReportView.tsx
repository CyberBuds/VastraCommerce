'use client';

import * as React from 'react';
import { usePaymentGateways } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { CreditCard, CheckCircle2, AlertCircle, Percent, DollarSign } from 'lucide-react';

export function PaymentsReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: gateways = [] } = usePaymentGateways();

  const totalVolume = gateways.reduce((acc, curr) => acc + curr.totalVolume, 0);
  const totalFees = gateways.reduce((acc, curr) => acc + curr.feeAmount, 0);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Payment Gateway Telemetry & Settlement Audit"
        description="Transaction volumes, merchant processing fee overheads, settlement reconciliation, and failure rate monitoring."
        breadcrumbs={[{ label: 'Payment Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Processed Payment Volume" value={`$${totalVolume.toLocaleString()}`} change={11.2} icon={CreditCard} />
        <ReportKpiCard title="Gateway Processing Overhead" value={`$${totalFees.toLocaleString()}`} subtext="Merchant processing fees" icon={DollarSign} />
        <ReportKpiCard title="Overall Gateway Success Rate" value="98.2%" change={0.4} icon={CheckCircle2} />
        <ReportKpiCard title="Outstanding Settlements" value="$42,500" subtext="Pending bank transfer" icon={AlertCircle} />
      </div>

      <ReportDataTable
        title="Payment Gateway Performance Ledger"
        data={gateways}
        columns={[
          { header: 'Gateway Provider', accessorKey: 'gateway' },
          { header: 'Payment Method', accessorKey: 'method' },
          { header: 'Total Transactions', accessorKey: 'transactionsCount' },
          { header: 'Successful', accessorKey: 'successfulCount' },
          { header: 'Failed', accessorKey: 'failedCount' },
          {
            header: 'Processed Volume',
            accessorKey: (r) => <span className="font-mono font-bold">${r.totalVolume.toLocaleString()}</span>,
          },
          {
            header: 'Processing Fees',
            accessorKey: (r) => <span className="font-mono text-rose-600">${r.feeAmount.toLocaleString()}</span>,
          },
          {
            header: 'Success Rate',
            accessorKey: (r) => <span className="font-bold text-emerald-600">{r.successRate}%</span>,
          },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
