'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button } from '@/components/enterprise/BaseInputs';
import {
  Cpu,
  HardDrive,
  Database,
  Activity,
  ShieldAlert,
  Zap,
  Server,
  Users,
  RefreshCw,
  Clock,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export function SystemDashboardView() {
  const {
    healthMetrics,
    auditLogs,
    featureFlags,
    cacheStatus,
    users,
    backups,
    refreshHealthMetrics,
    flushCache,
    createBackup,
  } = useSystemStore();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshHealthMetrics();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('System telemetry updated in real time');
    }, 600);
  };

  const activeFlagsCount = featureFlags.filter((f) => f.status === 'ENABLED' || f.status === 'BETA_ROLLOUT').length;
  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length;
  const latestBackup = backups[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Server className="w-4 h-4 animate-pulse" />
            <span>Cluster Status: Operational</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">System Administration Console</h1>
          <p className="text-xs text-slate-300">
            Enterprise infrastructure oversight, security governance, cache & disaster recovery
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            icon={RefreshCw}
            className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 font-semibold"
          >
            Sync Metrics
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              createBackup('MANUAL');
              toast.success('Manual SQL Snapshot created & archived');
            }}
            icon={Database}
            className="font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 border-none"
          >
            Create Snapshot
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Load */}
        <Card className="border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">CPU Usage</p>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-1">
                {healthMetrics.cpuUsagePercent}%
              </p>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${healthMetrics.cpuUsagePercent}%` }}
            />
          </div>
        </Card>

        {/* Memory Usage */}
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">RAM Allocation</p>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-1">
                {healthMetrics.memoryUsagePercent}%
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${healthMetrics.memoryUsagePercent}%` }}
            />
          </div>
        </Card>

        {/* DB Connection Pool */}
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">DB Connection Pool</p>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-1">
                {healthMetrics.activeDbConnections} / {healthMetrics.maxDbConnections}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-3">
            Response latency: <span className="text-slate-700 dark:text-zinc-200 font-bold">{healthMetrics.avgResponseMs} ms</span>
          </p>
        </Card>

        {/* Active Flags & Users */}
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Active Flags & Seats</p>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-1">
                {activeFlagsCount} <span className="text-xs text-slate-400 font-normal">flags</span> / {activeUsersCount} <span className="text-xs text-slate-400 font-normal">users</span>
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-3">
            Cache hit ratio: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{healthMetrics.cacheHitRatioPercent}%</span>
          </p>
        </Card>
      </div>

      {/* Quick Action Control Hub */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Quick Administrative Operations</span>
          </div>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center p-4 h-auto text-center gap-2 border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20"
            onClick={() => {
              flushCache('ALL');
              toast.success('Purged all Redis / Memory cache clusters');
            }}
          >
            <RotateCcw className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-zinc-100">Flush All Caches</span>
              <span className="text-[10px] text-slate-500">Invalidate catalog & routes</span>
            </div>
          </Button>

          <Link href="/dashboard/system/logs">
            <Button
              variant="outline"
              className="w-full flex flex-col items-center justify-center p-4 h-auto text-center gap-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
            >
              <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-zinc-100">Audit Trail Logs</span>
                <span className="text-[10px] text-slate-500">Inspect user actions & diffs</span>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/system/feature-flags">
            <Button
              variant="outline"
              className="w-full flex flex-col items-center justify-center p-4 h-auto text-center gap-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20"
            >
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-zinc-100">Feature Toggles</span>
                <span className="text-[10px] text-slate-500">Manage rollouts & flags</span>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/system/health">
            <Button
              variant="outline"
              className="w-full flex flex-col items-center justify-center p-4 h-auto text-center gap-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
            >
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-zinc-100">Cluster Diagnostics</span>
                <span className="text-[10px] text-slate-500">View live memory & queues</span>
              </div>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Two Column Layout: Recent Audit Logs & System Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Audit Log Stream */}
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Recent Security Audit Stream</span>
                </div>
                <Link href="/dashboard/system/logs" className="text-xs text-sky-600 hover:underline font-bold">
                  View All Logs &rarr;
                </Link>
              </div>
            }
          >
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-zinc-100">{log.userName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-zinc-400">{log.details}</p>
                  </div>
                  <div className="text-right whitespace-nowrap text-[11px] text-slate-400">
                    <p>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="font-mono text-[10px]">{log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System & Disaster Recovery Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            header={
              <div className="flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Snapshot & Recovery Status</span>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">Latest Database Snapshot</span>
                  <span className="text-[11px] text-slate-500 font-mono">{latestBackup?.filename || 'No backup found'}</span>
                </div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md">
                  {latestBackup?.sizeMb} MB
                </span>
              </div>

              <Alert
                type="info"
                title="Automated Backups Active"
                description="Daily database dump scheduled at 00:00 UTC. Retention period: 90 days."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
