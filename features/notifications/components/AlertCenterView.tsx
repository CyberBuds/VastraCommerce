'use client';

import * as React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useSystemAlerts, useResolveAlertMutation } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';

export function AlertCenterView() {
  const { data: alerts, isLoading } = useSystemAlerts();
  const resolveMutation = useResolveAlertMutation();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">System Monitoring Alert Center</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Critical gateway throttles, dead letter thresholds, and infrastructure incidents requiring SecOps action.
        </p>
      </div>

      <div className="space-y-4">
        {alerts?.map((alt) => {
          const isCritical = alt.severity === 'critical';
          const isWarning = alt.severity === 'warning';
          const isResolved = alt.status === 'resolved';

          return (
            <div
              key={alt.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isResolved
                  ? 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 opacity-70'
                  : isCritical
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCritical ? (
                  <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase">{alt.id}</span>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-white/50 dark:bg-black/30">
                      {alt.severity}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mt-1">{alt.title}</h3>
                  <p className="text-xs opacity-90 mt-1">{alt.message}</p>
                  <div className="text-[11px] opacity-75 mt-2">
                    Source: {alt.source} &bull; Triggered: {alt.createdAt}
                  </div>
                </div>
              </div>

              {!isResolved && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={resolveMutation.isPending}
                  onClick={() => resolveMutation.mutate(alt.id)}
                  className="shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Resolved
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
