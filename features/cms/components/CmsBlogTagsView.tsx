'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Label } from '@/components/enterprise/BaseInputs';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function CmsBlogTagsView() {
  const { tags, addTag, deleteTag } = useCmsStore();
  const [name, setName] = React.useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addTag({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    setName('');
    toast.success(`Tag #${name} created!`);
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Content Tags & Topics"
        description="Manage keyword tags for cross-linking whitepapers, blog articles, and documentation."
        breadcrumbs={[{ label: 'Blogs', href: '/cms/blogs' }, { label: 'Tags' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-500" /> Create Tag
          </h3>

          <div>
            <Label htmlFor="tagName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Tag Keyword
            </Label>
            <Input id="tagName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Next.js 15" className="mt-1 text-xs" required />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Add Tag
          </Button>
        </form>

        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-3 mb-4">
            Active Keyword Tags Index
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {tags.map((t) => (
              <div
                key={t.id}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2 group hover:border-slate-400 dark:hover:border-zinc-700 transition-all"
              >
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                <span>#{t.name}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                  {t.count}
                </span>
                <button
                  onClick={() => {
                    deleteTag(t.id);
                    toast.success('Tag removed');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
