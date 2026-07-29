'use client';

import * as React from 'react';
import { useShippingPerformance } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Truck, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ShippingPerformanceItem } from '../types/reportsTypes';

export function ShippingReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: shipping = [] } = useShippingPerformance();

  const totalShipments = shipping.reduce((a, b) => a + b.totalShipments, 0);
  const totalCost = shipping.reduce((a, b) => a + b.totalCost, 0);

  const shippingWithIds: (ShippingPerformanceItem & { id: string })[] =
    shipping.map((item) => ({
      ...item,
      id: item.courierName,
    }));

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Logistics & Carrier Performance Analytics"
        description="Freight carrier SLA compliance, transit duration benchmarks, shipping expense audit, and delayed delivery tracking."
        breadcrumbs={[{ label: 'Shipping Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard
          title="Total Dispatched Freight"
          value={totalShipments.toLocaleString()}
          change={7.8}
          icon={Truck}
        />
        <ReportKpiCard
          title="Total Logistics Expenditure"
          value={`$${totalCost.toLocaleString()}`}
          icon={Clock}
        />
        <ReportKpiCard
          title="Overall Carrier SLA Rate"
          value="97.2%"
          change={0.8}
          icon={CheckCircle2}
        />
        <ReportKpiCard
          title="Delayed / Exception Freight"
          value="420 pkgs"
          subtext="Under resolution"
          icon={AlertTriangle}
          iconColorClass="text-amber-600 bg-amber-500/10"
        />
      </div>

      <ReportDataTable
        title="Carrier Performance SLA & Expense Audit"
        data={shippingWithIds}
        columns={[
          { header: 'Courier Partner', accessorKey: 'courierName' },
          { header: 'Shipments Handled', accessorKey: 'totalShipments' },
          { header: 'On-Time Deliveries', accessorKey: 'deliveredOnTime' },
          {
            header: 'Delayed / Exceptions',
            accessorKey: (r) => `${r.delayedCount} / ${r.failedCount}`,
          },
          {
            header: 'Avg Transit Time',
            accessorKey: (r) => `${r.avgDeliveryHours} Hours`,
          },
          {
            header: 'Freight Expense',
            accessorKey: (r) => (
              <span className="font-mono font-bold">
                ${r.totalCost.toLocaleString()}
              </span>
            ),
          },
          {
            header: 'SLA Pass Rate',
            accessorKey: (r) => (
              <span className="font-bold text-emerald-600">{r.slaRate}%</span>
            ),
          },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
