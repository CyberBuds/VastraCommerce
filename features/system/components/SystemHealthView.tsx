'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button } from '@/components/enterprise/BaseInputs';
import { Cpu, HardDrive, Database, Activity, RefreshCw, Server, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function SystemHealthView() {
  const { healthMetrics, refreshHealthMetrics } = useSystemStore();

  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    refreshHealthMetrics();
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Telemetry telemetry refreshed from node clusters');
    }, 500);
  };

  const uptimeDays = (healthMetrics.uptimeSeconds / 86400).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Cluster Health Diagnostics & Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Real-time memory distribution, database pool utilization, background task queues, and node latency
          </p>
        </div>
        <Button variant="primary" icon={RefreshCw} isLoading={isSyncing} onClick={handleSync}>
          Refresh Telemetry
        </Button>
      </div>

      {/* Cluster Overview Banner */}
      <Alert
        type="success"
        title={`Cluster Uptime: ${uptimeDays} Days Continuous Operation`}
        description="All background worker processes, Redis cache nodes, and PostgreSQL connection pools are responding normally."
      />

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CPU */}
        <Card header={<span className="font-bold text-xs uppercase text-slate-400">Node CPU Load</span>}>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 dark:text-zinc-100">{healthMetrics.cpuUsagePercent}%</span>
              <span className="text-xs text-slate-400 font-mono">16 VCPU Cores</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${healthMetrics.cpuUsagePercent}%` }}
              />
            </div>
          </div>
        </Card>

        {/* RAM */}
        <Card header={<span className="font-bold text-xs uppercase text-slate-400">Memory Allocation</span>}>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 dark:text-zinc-100">{healthMetrics.memoryUsagePercent}%</span>
              <span className="text-xs text-slate-400 font-mono">26.9 GB / 64 GB</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${healthMetrics.memoryUsagePercent}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Disk */}
        <Card header={<span className="font-bold text-xs uppercase text-slate-400">NVMe Disk Usage</span>}>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 dark:text-zinc-100">{healthMetrics.diskUsagePercent}%</span>
              <span className="text-xs text-slate-400 font-mono">159 GB / 500 GB</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${healthMetrics.diskUsagePercent}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Server className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Database Pool & Queue Telemetry</span>
          </div>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-100 dark:divide-zinc-800">
          <div className="p-2">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 block">{healthMetrics.activeDbConnections}</span>
            <span className="text-xs text-slate-400 font-semibold">Active DB Pools</span>
          </div>

          <div className="p-2">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 block">{healthMetrics.queuePendingJobs}</span>
            <span className="text-xs text-slate-400 font-semibold">BullMQ Pending Jobs</span>
          </div>

          <div className="p-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">{healthMetrics.avgResponseMs} ms</span>
            <span className="text-xs text-slate-400 font-semibold">Avg API Latency</span>
          </div>

          <div className="p-2">
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400 block">{healthMetrics.cacheHitRatioPercent}%</span>
            <span className="text-xs text-slate-400 font-semibold">Cache Hit Ratio</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
