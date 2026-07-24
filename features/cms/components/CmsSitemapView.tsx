'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button } from '@/components/enterprise/BaseInputs';
import { Zap, RefreshCw, ExternalLink, FileCode } from 'lucide-react';
import { toast } from 'sonner';

export function CmsSitemapView() {
  const { sitemaps } = useCmsStore();

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Dynamic XML Sitemap Generator"
        description="Automated sitemap.xml indexing engine for search engines (Googlebot, Bingbot)."
        breadcrumbs={[{ label: 'Sitemap' }]}
        actionButton={{
          label: 'Regenerate Sitemap Index',
          icon: <RefreshCw className="w-4 h-4" />,
          onClick: () => toast.success('Regenerated /sitemap.xml index with 142 URLs.'),
        }}
      />

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-500" /> Active XML Sitemap Indexes
          </h3>
          <span className="text-xs text-emerald-600 font-bold">Live Status: OK</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {sitemaps.map((s) => (
            <div key={s.id} className="py-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 font-mono">{s.loc}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Priority: {s.priority} • Changefreq: {s.changefreq}</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 font-mono">
                Updated {new Date(s.lastmod).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
