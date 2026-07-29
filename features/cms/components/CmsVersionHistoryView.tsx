'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { VersionRevision } from '@/types/cms';
import { History, GitCommit, RotateCcw, User } from 'lucide-react';
import { toast } from 'sonner';

export function CmsVersionHistoryView() {
  const { versions } = useCmsStore();

  const handleRollback = (revisionId: string, versionNumber: number) => {
    toast.success(`Rolled back content to Revision v${versionNumber}.0!`);
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Audit Logs & Content Revision History"
        description="Track all content edits, compare historical versions, and perform instant zero-downtime rollbacks."
        breadcrumbs={[{ label: 'Version History' }]}
      />

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" /> Version Control Audit Trail
          </h3>
          <span className="text-xs text-indigo-600 font-bold">{versions.length} Commits</span>
        </div>

        <div className="space-y-3">
          {versions.map((rev: VersionRevision) => (
            <div key={rev.id} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 font-bold text-xs font-mono">
                  v{rev.versionNumber}.0
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{rev.summaryNote}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {rev.author}</span>
                    <span>• {new Date(rev.createdAt).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRollback(rev.id, rev.versionNumber)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                <span>Restore v{rev.versionNumber}.0</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
