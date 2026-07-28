'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { Compass, Plus, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function CmsRedirectsView() {
  const { redirects, addRedirect, deleteRedirect } = useCmsStore();

  const [sourceUrl, setSourceUrl] = React.useState('');
  const [targetUrl, setTargetUrl] = React.useState('');
  const [statusCode, setStatusCode] = React.useState<301 | 302>(301);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl || !targetUrl) return;

    addRedirect({
      sourceUrl,
      targetUrl,
      statusCode,
      status: 'ACTIVE',
    });

    setSourceUrl('');
    setTargetUrl('');
    toast.success('Added URL redirect rule!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="301 & 302 URL Redirect Engine"
        description="Prevent 404 errors during site migrations and URL restructuring with real-time redirect rules."
        breadcrumbs={[{ label: 'Redirects' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Create Redirect Rule
          </h3>

          <div>
            <Label htmlFor="sourceUrl" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Old / Source Path *</Label>
            <Input id="sourceUrl" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="/old-services-page" className="mt-1 text-xs font-mono" required />
          </div>

          <div>
            <Label htmlFor="targetUrl" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Destination Path *</Label>
            <Input id="targetUrl" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="/solutions" className="mt-1 text-xs font-mono" required />
          </div>

          <div>
            <Label htmlFor="statusCode" className="text-xs font-bold text-slate-700 dark:text-zinc-300">HTTP Status Code</Label>
            <Select id="statusCode" value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)} className="mt-1 text-xs font-bold">
              <option value={301}>301 - Permanent Redirect</option>
              <option value={302}>302 - Temporary Redirect</option>
            </Select>
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Save Redirect Rule
          </Button>
        </form>

        <div className="lg:col-span-2 space-y-3">
          {redirects.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${r.statusCode === 301 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {r.statusCode}
                </span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-800 dark:text-zinc-200 font-bold">{r.sourceUrl}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{r.targetUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[11px] text-slate-400 font-medium">{r.hits} hits</span>
                <button
                  onClick={() => {
                    deleteRedirect(r.id);
                    toast.success('Deleted redirect rule');
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
    </div>
  );
}
