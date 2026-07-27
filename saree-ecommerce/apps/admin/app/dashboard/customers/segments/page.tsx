'use client';

import * as React from 'react';
import { useCustomerSegments, useCreateSegment, useUpdateSegment, useDeleteSegment } from '@/hooks/useCustomers';
import { Badge, Button, Input } from '@/components/enterprise/BaseInputs';
import { Users, Plus, Check, Trash2, Sliders } from 'lucide-react';

export default function CustomerSegmentsPage() {
  const { data: segments = [], isLoading } = useCustomerSegments();
  const createSegmentMutation = useCreateSegment();
  const updateSegmentMutation = useUpdateSegment();
  const deleteSegmentMutation = useDeleteSegment();

  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    minRevenue: '',
    minPoints: '',
    minWallet: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rules: any = {};
    if (formData.minRevenue) rules.minRevenue = parseFloat(formData.minRevenue);
    if (formData.minPoints) rules.minPoints = parseInt(formData.minPoints);
    if (formData.minWallet) rules.minWallet = parseFloat(formData.minWallet);

    createSegmentMutation.mutate({
      name: formData.name,
      code: `seg-${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
      rules
    }, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ name: '', minRevenue: '', minPoints: '', minWallet: '' });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the dynamic segment "${name}"?`)) {
      deleteSegmentMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6" id="customer-segments-page-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Sliders className="w-5.5 h-5.5 text-slate-800" />
            Dynamic Marketing & Segment Groups
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Define filters based on lifetime spend, wallet reserves, and loyalty ratings to segment your cohort for bulk marketing.
          </p>
        </div>
        <div>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Configure Segment
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-2">
          <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent animate-spin rounded-full" />
          <span className="text-xs text-slate-400 font-mono">Compiling demographic segments...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg) => (
            <div 
              key={seg.id} 
              className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-slate-900 dark:text-zinc-50 text-sm">
                    {seg.name}
                  </h3>
                  <Badge variant="neutral" className="font-mono text-xs">
                    {seg.memberCount} members
                  </Badge>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800 text-[11px] space-y-1 text-slate-600 dark:text-zinc-400">
                  <span className="font-bold font-mono text-[9px] text-slate-400 block uppercase">Matching Rules Formula</span>
                  {(seg.rules?.minRevenue !== undefined || seg.queryConfig?.minRevenue !== undefined) && (
                    <p>• Lifetime Purchases ≥ ₹{(seg.rules?.minRevenue ?? seg.queryConfig?.minRevenue ?? 0).toLocaleString()}</p>
                  )}
                  {(seg.rules?.minPoints !== undefined || seg.queryConfig?.minLoyaltyPoints !== undefined) && (
                    <p>• Loyalty Points balance ≥ {(seg.rules?.minPoints ?? seg.queryConfig?.minLoyaltyPoints ?? 0).toLocaleString()}</p>
                  )}
                  {(seg.rules?.minWallet !== undefined || seg.queryConfig?.minWalletBalance !== undefined) && (
                    <p>• Wallet Asset reserves ≥ ₹{(seg.rules?.minWallet ?? seg.queryConfig?.minWalletBalance ?? 0).toLocaleString()}</p>
                  )}
                  {seg.queryConfig?.lastLoginAfter && (
                    <p>• Last login after {new Date(seg.queryConfig.lastLoginAfter).toLocaleDateString()}</p>
                  )}
                  {!seg.rules && !seg.queryConfig && <p>• Matches all registered cohort profiles</p>}
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">Query Code ID: {seg.code || seg.id}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600"
                  onClick={() => handleDelete(seg.id, seg.name)}
                  title="Purge Segment"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM OVERLAY */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-150">
                Setup Dynamic Query Segment
              </h4>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <Input
                label="Segment Name *"
                required
                placeholder="e.g. VIP Spenders (INR 10k+)"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              />

              <Input
                label="Minimum Lifetime spend (INR)"
                type="number"
                placeholder="e.g. 10000"
                value={formData.minRevenue}
                onChange={(e) => setFormData(p => ({ ...p, minRevenue: e.target.value }))}
              />

              <Input
                label="Minimum Loyalty points score"
                type="number"
                placeholder="e.g. 500"
                value={formData.minPoints}
                onChange={(e) => setFormData(p => ({ ...p, minPoints: e.target.value }))}
              />

              <Input
                label="Minimum Wallet asset reserves (INR)"
                type="number"
                placeholder="e.g. 2000"
                value={formData.minWallet}
                onChange={(e) => setFormData(p => ({ ...p, minWallet: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" isLoading={createSegmentMutation.isPending}>
                <Check className="w-4 h-4 mr-1.5" /> Compile Segment Group
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
