'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button } from '@/components/enterprise/BaseInputs';
import { Layout, Plus, Trash2, Eye, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function CmsLandingPagesView() {
  const { landingPages, deleteLandingPage } = useCmsStore();

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Landing Pages & Campaign Builders"
        description="High-converting marketing campaign pages with hero banners, CTA blocks, and conversion tracking."
        breadcrumbs={[{ label: 'Landing Pages' }]}
        actionButton={{
          label: 'Create Landing Page',
          onClick: () => toast.info('Landing page builder wizard active'),
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {landingPages.map((page) => (
          <div key={page.id} className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  {page.heroSection.badgeText || 'CAMPAIGN'}
                </span>
                <span className="text-xs font-mono text-slate-400">/{page.slug}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{page.title}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{page.heroSection.headline}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">CTA Button:</span>
                <strong className="text-slate-800 dark:text-zinc-200">{page.heroSection.ctaLabel}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Conversions:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{page.conversions.toLocaleString()} leads</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Conversion Rate:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{((page.conversions / (page.views || 1)) * 100).toFixed(1)}%</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Published
              </span>
              <button
                onClick={() => {
                  deleteLandingPage(page.id);
                  toast.success('Landing page deleted');
                }}
                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
