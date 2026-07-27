'use client';

import * as React from 'react';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Award, Users, Star, Gift } from 'lucide-react';

const mockLoyaltyTiers = [
  { tier: 'Titanium Defense (Tier 1)', members: 140, totalPointsIssued: 4500000, pointsRedeemed: 3200000, retentionRate: '98.5%' },
  { tier: 'Gold Aviation (Tier 2)', members: 480, totalPointsIssued: 2100000, pointsRedeemed: 1400000, retentionRate: '92.1%' },
  { tier: 'Silver Carrier (Tier 3)', members: 1250, totalPointsIssued: 980000, pointsRedeemed: 520000, retentionRate: '84.0%' },
];

export function LoyaltyReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="B2B Loyalty Program & Rewards Analytics"
        description="Tier distribution, points issuance vs redemption velocity, VIP retention rates, and reward liability management."
        breadcrumbs={[{ label: 'Loyalty Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Active Loyalty Members" value="1,870" change={6.4} icon={Users} />
        <ReportKpiCard title="Points Issued (YTD)" value="7.58M pts" change={12.0} icon={Star} />
        <ReportKpiCard title="Points Redemption Rate" value="67.5%" change={3.2} icon={Gift} />
        <ReportKpiCard title="Tier 1 VIP Retention" value="98.5%" change={0.5} icon={Award} />
      </div>

      <ReportDataTable
        title="Loyalty Tier Performance Matrix"
        data={mockLoyaltyTiers}
        columns={[
          { header: 'Membership Tier', accessorKey: 'tier' },
          { header: 'Active Members', accessorKey: 'members' },
          { header: 'Points Accrued', accessorKey: (r) => `${(r.totalPointsIssued / 1000000).toFixed(2)}M pts` },
          { header: 'Points Redeemed', accessorKey: (r) => `${(r.pointsRedeemed / 1000000).toFixed(2)}M pts` },
          { header: 'Retention Rate', accessorKey: (r) => <span className="font-bold text-emerald-600">{r.retentionRate}</span> },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
