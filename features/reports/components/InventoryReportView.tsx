'use client';

import * as React from 'react';
import { useInventoryValuation } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Package, AlertTriangle, XCircle, Warehouse, DollarSign } from 'lucide-react';

export function InventoryReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: items = [] } = useInventoryValuation();

  const totalCost = items.reduce((acc, curr) => acc + curr.totalCostValue, 0);
  const totalRetail = items.reduce((acc, curr) => acc + curr.totalRetailValue, 0);
  const lowStockCount = items.filter((i) => i.status === 'LOW_STOCK').length;
  const outOfStockCount = items.filter((i) => i.status === 'OUT_OF_STOCK').length;

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Inventory Valuation & Stock Aging Audit"
        description="Warehouse level inventory valuation, low stock alerts, stock turnover velocity, and batch expiry tracking."
        breadcrumbs={[{ label: 'Inventory Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Total Cost Basis" value={`$${totalCost.toLocaleString()}`} icon={DollarSign} />
        <ReportKpiCard title="Total Retail Value" value={`$${totalRetail.toLocaleString()}`} change={8.2} icon={Warehouse} />
        <ReportKpiCard title="Low Stock Alerts" value={lowStockCount} subtext="Requires replenishment" icon={AlertTriangle} iconColorClass="text-amber-600 bg-amber-500/10" />
        <ReportKpiCard title="Out of Stock SKUs" value={outOfStockCount} subtext="Zero available units" icon={XCircle} iconColorClass="text-rose-600 bg-rose-500/10" />
      </div>

      <ReportDataTable
        title="Warehouse Inventory Valuation Ledger"
        data={items}
        columns={[
          { header: 'SKU Code', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.sku}</span> },
          { header: 'Product Description', accessorKey: 'productName' },
          { header: 'Warehouse Location', accessorKey: 'warehouse' },
          { header: 'OnHand', accessorKey: 'stockOnHand' },
          { header: 'Reserved', accessorKey: 'reservedStock' },
          {
            header: 'Unit Cost / Retail',
            accessorKey: (r) => <span className="font-mono text-xs">${r.costPrice} / ${r.retailPrice}</span>,
          },
          {
            header: 'Total Cost Valuation',
            accessorKey: (r) => <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">${r.totalCostValue.toLocaleString()}</span>,
          },
          {
            header: 'Status',
            accessorKey: (r) => (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                r.status === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                r.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' :
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
