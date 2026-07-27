'use client';

import * as React from 'react';
import { useExecutiveMetrics } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { RotateCcw, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

const mockRefunds = [
  { id: 'ref-101', rmaNumber: 'RMA-2026-089', orderNumber: 'ORD-9821', customerName: 'Boeing Global Logistics', reason: 'Defective Avionics Board', amount: 14500, status: 'APPROVED', date: '2026-07-20' },
  { id: 'ref-102', rmaNumber: 'RMA-2026-090', orderNumber: 'ORD-9854', customerName: 'Airbus Defense', reason: 'Incorrect Part Specification', amount: 8200, status: 'COMPLETED', date: '2026-07-19' },
  { id: 'ref-103', rmaNumber: 'RMA-2026-091', orderNumber: 'ORD-9870', customerName: 'Rolls-Royce Aero', reason: 'Transit Damage', amount: 22000, status: 'PROCESSING', date: '2026-07-18' },
  { id: 'ref-104', rmaNumber: 'RMA-2026-092', orderNumber: 'ORD-9888', customerName: 'Northrop Grumman', reason: 'Order Cancelled Prior to Dispatch', amount: 6400, status: 'COMPLETED', date: '2026-07-15' },
];

export function RefundsReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: metrics } = useExecutiveMetrics();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Refunds, Returns & Credit Adjustments"
        description="Audit return authorizations (RMAs), dispute reasons, inventory restock costs, and net revenue impact."
        breadcrumbs={[{ label: 'Refund Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Total Refund Volume" value={`$${((metrics?.refundAmount || 0) / 1000).toFixed(1)}k`} change={-8.4} icon={RotateCcw} />
        <ReportKpiCard title="Active RMA Requests" value="14" subtext="In auditing queue" icon={AlertTriangle} iconColorClass="text-amber-600 bg-amber-500/10" />
        <ReportKpiCard title="Completed Restocks" value="48" change={4.2} icon={CheckCircle2} />
        <ReportKpiCard title="Refund % of Gross Revenue" value="2.4%" change={-0.3} icon={DollarSign} />
      </div>

      <ReportDataTable
        title="Return & Refund Audit Log"
        data={mockRefunds}
        columns={[
          { header: 'RMA Number', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.rmaNumber}</span> },
          { header: 'Order Ref', accessorKey: 'orderNumber' },
          { header: 'Customer Account', accessorKey: 'customerName' },
          { header: 'Return Cause', accessorKey: 'reason' },
          { header: 'Amount', accessorKey: (r) => <span className="font-mono font-bold text-rose-600">${r.amount.toLocaleString()}</span> },
          { header: 'Status', accessorKey: 'status' },
          { header: 'Date', accessorKey: 'date' },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
