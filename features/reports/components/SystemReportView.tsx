'use client';

import * as React from 'react';
import { useSystemMetrics } from '@/features/reports/hooks/useReports';
import { ReportsHeader } from './ReportsHeader';
import { ReportFilterPanel } from './ReportFilterPanel';
import { ReportKpiCard } from './ReportKpiCard';
import { ReportChartCard } from './ReportChartCard';
import { ReportDataTable } from './ReportDataTable';
import { ReportExportModal } from './ReportExportModal';
import { Cpu, HardDrive, Activity, Server, Database } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function SystemReportView() {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const { data: metrics = [] } = useSystemMetrics();

  const currentCpu = metrics[metrics.length - 1]?.cpuUsagePct || 35;
  const currentRam = metrics[metrics.length - 1]?.memoryUsagePct || 59;
  const currentReq = metrics[metrics.length - 1]?.apiRequestsPerMin || 1600;
  const tableData = metrics.map((metric) => ({ ...metric, id: metric.timestamp }));

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Server Health & System Telemetry"
        description="Infrastructure health diagnostics: CPU/RAM load, API endpoint latency, database connection pools, background worker queues, and error rate telemetry."
        breadcrumbs={[{ label: 'System Reports' }]}
        showFiltersToggle
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {isFiltersOpen && <ReportFilterPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard title="CPU Utilization" value={`${currentCpu}%`} subtext="Cloud Run vCPU load" icon={Cpu} />
        <ReportKpiCard title="RAM Allocation" value={`${currentRam}%`} subtext="Memory utilization" icon={HardDrive} />
        <ReportKpiCard title="API Throughput" value={`${currentReq} req/min`} change={5.2} icon={Activity} />
        <ReportKpiCard title="DB Pool Connections" value="26 / 50" subtext="PostgreSQL / Firestore pool" icon={Database} />
      </div>

      <ReportChartCard title="API Request Load & Latency Timeline" subtitle="Requests per minute vs average response latency">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
            <Line type="monotone" dataKey="apiRequestsPerMin" name="Requests / Min" stroke="#6366f1" strokeWidth={2.5} />
            <Line type="monotone" dataKey="avgLatencyMs" name="Avg Latency (ms)" stroke="#10b981" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </ReportChartCard>

      <ReportDataTable
        title="System Telemetry History"
        data={tableData}
        columns={[
          { header: 'Time Slot', accessorKey: 'timestamp' },
          { header: 'CPU Load', accessorKey: (r) => `${r.cpuUsagePct}%` },
          { header: 'RAM Load', accessorKey: (r) => `${r.memoryUsagePct}%` },
          { header: 'API Req/Min', accessorKey: 'apiRequestsPerMin' },
          { header: 'Latency', accessorKey: (r) => `${r.avgLatencyMs} ms` },
          { header: 'Error Rate', accessorKey: (r) => `${r.errorRatePct}%` },
          { header: 'Active Queue Jobs', accessorKey: 'activeJobsCount' },
          { header: 'DB Connections', accessorKey: 'dbPoolConnections' },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
