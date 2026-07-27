'use client';

import * as React from 'react';
import { useInventoryValuation, useSalesByCategory } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Package, Star, TrendingUp, DollarSign } from 'lucide-react';

export function ProductsReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: items = [] } = useInventoryValuation();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Product Performance & Sales Velocity"
        description="Analyze best-selling SKUs, individual item gross margins, return frequency, and revenue velocity."
        breadcrumbs={[{ label: 'Product Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Active Catalog SKUs" value="3,820" change={5.2} icon={Package} />
        <ReportKpiCard title="Top Performing SKU" value="AV-RAD-09" subtext="Weather Radar Pro X9" icon={Star} />
        <ReportKpiCard title="Avg Product Gross Margin" value="42.8%" change={2.1} icon={TrendingUp} />
        <ReportKpiCard title="Product Sales Velocity" value="142 units/day" change={8.4} icon={DollarSign} />
      </div>

      <ReportDataTable
        title="Product Performance Matrix"
        data={items}
        columns={[
          { header: 'SKU', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.sku}</span> },
          { header: 'Product Name', accessorKey: 'productName' },
          { header: 'Category', accessorKey: 'category' },
          { header: 'Stock Level', accessorKey: 'stockOnHand' },
          { header: 'Cost Price', accessorKey: (r) => <span className="font-mono">${r.costPrice}</span> },
          { header: 'Retail Price', accessorKey: (r) => <span className="font-mono">${r.retailPrice}</span> },
          {
            header: 'Valuation',
            accessorKey: (r) => <span className="font-mono font-bold text-emerald-600">${r.totalRetailValue.toLocaleString()}</span>,
          },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
