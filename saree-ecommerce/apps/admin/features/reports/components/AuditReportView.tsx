'use client';

import * as React from 'react';
import { useAuditLogs } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { ShieldCheck, ShieldAlert, UserCheck, KeyRound } from 'lucide-react';

export function AuditReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: logs = [] } = useAuditLogs();

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Security Audit & Compliance Activity Logs"
        description="Immutable administrative audit trail tracking user authentication events, role permission changes, data export triggers, and system rule changes."
        breadcrumbs={[{ label: 'Audit Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="Audit Events (24h)" value="1,420" change={2.1} icon={ShieldCheck} />
        <ReportKpiCard title="Security Alerts" value="1 Alert" subtext="Failed login attempt" icon={ShieldAlert} iconColorClass="text-amber-600 bg-amber-500/10" />
        <ReportKpiCard title="Active User Sessions" value="28 Staff" icon={UserCheck} />
        <ReportKpiCard title="Role Rule Changes" value="3 Modifications" icon={KeyRound} />
      </div>

      <ReportDataTable
        title="Administrative Security Audit Trail"
        data={logs}
        columns={[
          { header: 'Timestamp', accessorKey: (r) => <span className="font-mono text-xs">{new Date(r.timestamp).toLocaleString()}</span> },
          { header: 'User Identity', accessorKey: 'userEmail' },
          { header: 'Role', accessorKey: 'userRole' },
          { header: 'Action Triggered', accessorKey: (r) => <span className="font-mono font-bold text-indigo-600">{r.action}</span> },
          { header: 'Target Module', accessorKey: 'module' },
          { header: 'IP Address', accessorKey: (r) => <span className="font-mono">{r.ipAddress}</span> },
          {
            header: 'Result Status',
            accessorKey: (r) => (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                r.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
              }`}>
                {r.status}
              </span>
            ),
          },
          { header: 'Audit Details', accessorKey: 'details' },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
