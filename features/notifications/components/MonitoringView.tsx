'use client';

import * as React from 'react';
import { Activity, ShieldCheck, Server, RefreshCw, Cpu, Wifi } from 'lucide-react';
import { useProviderHealth, useNotificationStats } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';

export function MonitoringView() {
  const { data: providers, isLoading } = useProviderHealth();
  const { data: stats } = useNotificationStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Gateway Provider Health & Monitoring</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Real-time ping probes, rate-limit thresholds, uptime SLAs, and error rate telemetry for outbound services.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" /> Ping Gateways
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers?.map((p) => (
          <div key={p.providerName} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base">{p.providerName}</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  p.status === 'operational'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}
              >
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-zinc-850 p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Uptime SLA</span>
                <span className="font-bold text-base text-slate-900 dark:text-zinc-100">{p.uptime99}%</span>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-850 p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Latency</span>
                <span className="font-bold text-base text-slate-900 dark:text-zinc-100">{p.avgLatencyMs} ms</span>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-850 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-slate-400 block font-semibold">Error Rate</span>
                <span className="font-bold text-base text-rose-500">{p.errorRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span>Rate Limit Cap: <strong>{p.activeRateLimit}</strong></span>
              <span>Last Probe: <strong>{p.lastPing}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
