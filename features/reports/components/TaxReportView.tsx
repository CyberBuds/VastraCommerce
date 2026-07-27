'use client';

import * as React from 'react';
import { useExecutiveMetrics } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Receipt, ShieldCheck, Building2, Globe } from 'lucide-react';

const mockTaxLedger = [
  { id: 'tax-1', region: 'United States (WA - Seattle Hub)', taxCode: 'WA-ST-8.8', taxableSales: 980000, taxRate: '8.80%', taxCollected: 86240, status: 'FILED' },
  { id: 'tax-2', region: 'European Union (VAT - Germany)', taxCode: 'EU-VAT-19', taxableSales: 640000, taxRate: '19.00%', taxCollected: 121600, status: 'PENDING_REMITTANCE' },
  { id: 'tax-3', region: 'Asia Pacific (GST - Singapore)', taxCode: 'SG-GST-9', taxableSales: 180000, taxRate: '9.00%', taxCollected: 16200, status: 'FILED' },
];

export function TaxReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: metrics } = useExecutiveMetrics();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Tax Liability & Compliance Ledger"
        description="Multi-jurisdiction sales tax liabilities, GST/VAT filings, state surcharges, and compliance audit reports."
        breadcrumbs={[{ label: 'Tax Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Total Tax Collected" value={`$${((metrics?.taxCollected || 0) / 1000).toFixed(1)}k`} change={9.2} icon={Receipt} />
        <ReportKpiCard title="Active Tax Jurisdictions" value="12 Regions" icon={Globe} />
        <ReportKpiCard title="Pending Tax Remittance" value="$121,600" subtext="EU VAT Q2 filing" icon={Building2} iconColorClass="text-amber-600 bg-amber-500/10" />
        <ReportKpiCard title="Tax Audit Readiness Score" value="100%" subtext="Fully reconciled" icon={ShieldCheck} iconColorClass="text-emerald-600 bg-emerald-500/10" />
      </div>

      <ReportDataTable
        title="Jurisdictional Tax Liability Ledger"
        data={mockTaxLedger}
        columns={[
          { header: 'Tax Jurisdiction Region', accessorKey: 'region' },
          { header: 'Tax Rule Code', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.taxCode}</span> },
          { header: 'Taxable Sales Basis', accessorKey: (r) => <span className="font-mono">${r.taxableSales.toLocaleString()}</span> },
          { header: 'Effective Rate', accessorKey: 'taxRate' },
          { header: 'Tax Amount Collected', accessorKey: (r) => <span className="font-mono font-bold text-emerald-600">${r.taxCollected.toLocaleString()}</span> },
          { header: 'Compliance Filing Status', accessorKey: 'status' },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
