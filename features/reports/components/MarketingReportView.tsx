'use client';

import * as React from 'react';
import { useMarketingCampaigns } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Megaphone, TrendingUp, DollarSign, Target, MessageSquare } from 'lucide-react';

export function MarketingReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: campaigns = [] } = useMarketingCampaigns();

  const totalSpend = campaigns.reduce((a, b) => a + b.spend, 0);
  const totalRevenue = campaigns.reduce((a, b) => a + b.revenueGenerated, 0);

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Marketing Channel Performance & Campaign ROI"
        description="Omnichannel marketing ROI tracking across Email, SMS, WhatsApp, Referral links, and Promo campaigns."
        breadcrumbs={[{ label: 'Marketing Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Campaign Media Spend" value={`$${totalSpend.toLocaleString()}`} icon={DollarSign} />
        <ReportKpiCard title="Attributed Campaign Revenue" value={`$${totalRevenue.toLocaleString()}`} change={18.5} icon={TrendingUp} />
        <ReportKpiCard title="Overall Campaign ROAS" value="15.2x" change={2.4} icon={Target} />
        <ReportKpiCard title="Total Conversions" value="1,200" change={12.0} icon={Megaphone} />
      </div>

      <ReportDataTable
        title="Marketing Campaign Performance Ledger"
        data={campaigns}
        columns={[
          { header: 'Campaign Name', accessorKey: 'campaignName' },
          { header: 'Marketing Channel', accessorKey: 'channel' },
          { header: 'Impressions', accessorKey: (r) => r.impressions.toLocaleString() },
          { header: 'Click-Throughs', accessorKey: (r) => r.clicks.toLocaleString() },
          { header: 'Conversions', accessorKey: 'conversions' },
          { header: 'Ad Spend', accessorKey: (r) => <span className="font-mono">${r.spend.toLocaleString()}</span> },
          { header: 'Attributed Revenue', accessorKey: (r) => <span className="font-mono font-bold text-emerald-600">${r.revenueGenerated.toLocaleString()}</span> },
          { header: 'ROAS / ROI', accessorKey: (r) => <span className="font-bold text-indigo-600">{r.roi}x</span> },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
