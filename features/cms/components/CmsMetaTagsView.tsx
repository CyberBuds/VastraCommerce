'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function CmsMetaTagsView() {
  const { metaRules, addMetaRule, deleteMetaRule } = useCmsStore();
  const [name, setName] = React.useState('');
  const [content, setContent] = React.useState('');
  const [type, setType] = React.useState<'name' | 'property' | 'http-equiv'>('name');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    addMetaRule({
      name,
      content,
      type,
    });

    setName('');
    setContent('');
    toast.success('Meta tag rule added!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Custom Meta Tags & OpenGraph Injections"
        description="Inject global HTML head meta tags, viewport settings, theme-color, and social site verification keys."
        breadcrumbs={[{ label: 'Meta Tags' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Inject Meta Tag
          </h3>

          <div>
            <Label htmlFor="type" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Attribute Type</Label>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 text-xs">
              <option value="name">name=&quot;...&quot;</option>
              <option value="property">property=&quot;...&quot; (OpenGraph)</option>
              <option value="http-equiv">http-equiv=&quot;...&quot;</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Key Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. og:site_name" className="mt-1 text-xs font-mono" required />
          </div>

          <div>
            <Label htmlFor="content" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Content Value *</Label>
            <Input id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enterprise Portal" className="mt-1 text-xs" required />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Save Meta Tag
          </Button>
        </form>

        <div className="lg:col-span-2 space-y-3">
          {metaRules.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600">
                  {m.type}
                </span>
                <p className="text-xs font-mono">
                  <strong className="text-slate-900 dark:text-zinc-100">{m.name}</strong> = &quot;{m.content}&quot;
                </p>
              </div>

              <button
                onClick={() => {
                  deleteMetaRule(m.id);
                  toast.success('Deleted meta rule');
                }}
                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
