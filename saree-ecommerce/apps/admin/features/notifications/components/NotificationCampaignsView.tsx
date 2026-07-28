'use client';

import * as React from 'react';
import { Target, Plus, Play, Pause, TrendingUp, BarChart2 } from 'lucide-react';
import { useNotificationCampaigns } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';

export function NotificationCampaignsView() {
  const { data: campaigns, isLoading } = useNotificationCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Communication Campaigns</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Multi-stage scheduled marketing and operational campaigns with engagement analytics.
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Launch New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns?.map((camp) => (
          <div key={camp.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase">{camp.id}</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">{camp.name}</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{camp.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 capitalize">
                {camp.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-zinc-850 p-3 rounded-xl text-center">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Open Rate</div>
                <div className="text-base font-bold text-slate-900 dark:text-zinc-100">{camp.openRate}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Click Rate</div>
                <div className="text-base font-bold text-slate-900 dark:text-zinc-100">{camp.clickRate}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Conversion</div>
                <div className="text-base font-bold text-emerald-600">{camp.conversionRate}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span>Target: <strong>{camp.targetAudience}</strong></span>
              <span>Total Sent: <strong>{camp.totalSent.toLocaleString()}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
