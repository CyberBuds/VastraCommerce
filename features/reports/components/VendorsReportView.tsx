'use client';

import * as React from 'react';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Building2, PackageCheck, Clock, ShieldCheck } from 'lucide-react';

const mockVendors = [
  { id: 'Honeywell Aerospace OEM', name: 'Honeywell Aerospace OEM', partsSupplied: 1240, spendBasis: 850000, avgLeadTimeDays: 4.2, defectRate: '0.01%', slaCompliance: '99.2%' },
  { id: 'Collins Aerospace Systems', name: 'Collins Aerospace Systems', partsSupplied: 980, spendBasis: 620000, avgLeadTimeDays: 5.1, defectRate: '0.03%', slaCompliance: '98.5%' },
  { id: 'Pratt & Whitney Propulsion', name: 'Pratt & Whitney Propulsion', partsSupplied: 450, spendBasis: 1120000, avgLeadTimeDays: 7.8, defectRate: '0.00%', slaCompliance: '99.8%' },
];

export function VendorsReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Vendor & Supplier Quality Analytics"
        description="Supplier procurement expenditure, component lead-time compliance, defect rates, and vendor rating scores."
        breadcrumbs={[{ label: 'Vendor Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Active Approved Suppliers" value="42" icon={Building2} />
        <ReportKpiCard title="Procurement Spend (YTD)" value="$2.59M" change={10.2} icon={PackageCheck} />
        <ReportKpiCard title="Avg Supplier Lead Time" value="5.2 Days" change={-0.6} icon={Clock} />
        <ReportKpiCard title="Parts Quality Pass Rate" value="99.96%" change={0.1} icon={ShieldCheck} />
      </div>

      <ReportDataTable
        title="Supplier Quality & Performance Scorecard"
        data={mockVendors}
        columns={[
          { header: 'Supplier Name', accessorKey: 'name' },
          { header: 'Parts Supplied', accessorKey: 'partsSupplied' },
          { header: 'Procurement Spend', accessorKey: (r) => <span className="font-mono font-bold">${r.spendBasis.toLocaleString()}</span> },
          { header: 'Avg Lead Time', accessorKey: (r) => `${r.avgLeadTimeDays} Days` },
          { header: 'Defect Rate', accessorKey: (r) => <span className="text-emerald-600 font-bold">{r.defectRate}</span> },
          { header: 'SLA Score', accessorKey: (r) => <span className="font-bold text-indigo-600">{r.slaCompliance}</span> },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
