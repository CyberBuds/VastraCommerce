'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Clock, Calendar, CheckCircle, Trash2, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export function CmsContentSchedulerView() {
  const { scheduledQueue } = useCmsStore();

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Automated Content Publishing Queue & Scheduler"
        description="Schedule timed publications, embargoed press releases, and automatic page deprecations."
        breadcrumbs={[{ label: 'Content Scheduler' }]}
      />

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" /> Pending Publishing Schedule
          </h3>
          <span className="text-xs text-purple-600 font-bold">{scheduledQueue.length} Queue Jobs</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {scheduledQueue.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 uppercase">
                    {item.contentType} • {item.action}
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{item.contentTitle}</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" /> Scheduled for: {new Date(item.scheduledAt).toLocaleString()}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
