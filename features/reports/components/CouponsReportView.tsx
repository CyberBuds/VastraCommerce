'use client';

import * as React from 'react';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Ticket, Percent, DollarSign, TrendingUp } from 'lucide-react';

const mockCoupons = [
  { code: 'AERO2026', type: 'PERCENTAGE', discount: '15% OFF', redemptions: 480, maxUses: 1000, totalDiscountGiven: 42000, revenueImpact: 280000 },
  { code: 'VIPSPRING', type: 'FIXED_AMOUNT', discount: '$250 OFF', redemptions: 120, maxUses: 200, totalDiscountGiven: 30000, revenueImpact: 195000 },
  { code: 'FREESHIP20', type: 'FREE_SHIPPING', discount: '100% Freight', redemptions: 850, maxUses: 5000, totalDiscountGiven: 12500, revenueImpact: 340000 },
];

export function CouponsReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Promotional Coupon & Voucher Utilization"
        description="Monitor promotional code redemption rates, margin erosion, and coupon-driven revenue liftoff."
        breadcrumbs={[{ label: 'Coupon Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Active Promo Codes" value="18" icon={Ticket} />
        <ReportKpiCard title="Total Redemptions" value="1,450" change={14.2} icon={Percent} />
        <ReportKpiCard title="Total Discounts Granted" value="$84,500" subtext="Promotional margin impact" icon={DollarSign} />
        <ReportKpiCard title="Coupon Attributed Sales" value="$815,000" change={19.1} icon={TrendingUp} />
      </div>

      <ReportDataTable
        title="Coupon Utilization & Revenue Influence"
        data={mockCoupons}
        columns={[
          { header: 'Promo Code', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.code}</span> },
          { header: 'Discount Type', accessorKey: 'type' },
          { header: 'Benefit', accessorKey: 'discount' },
          { header: 'Redemptions / Capacity', accessorKey: (r) => `${r.redemptions} / ${r.maxUses}` },
          { header: 'Total Discount Amount', accessorKey: (r) => <span className="font-mono text-rose-600">${r.totalDiscountGiven.toLocaleString()}</span> },
          { header: 'Revenue Generated', accessorKey: (r) => <span className="font-mono font-bold text-emerald-600">${r.revenueImpact.toLocaleString()}</span> },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
