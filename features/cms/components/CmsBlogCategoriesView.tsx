'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Label } from '@/components/enterprise/BaseInputs';
import { Folder, Plus, Trash2, Edit, Tag, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function CmsBlogCategoriesView() {
  const { categories, addCategory, deleteCategory } = useCmsStore();
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addCategory({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      status: 'ACTIVE',
      seo: {
        metaTitle: title,
        metaDescription: description,
        keywords: title.split(' ').join(', '),
      },
    });

    setTitle('');
    setSlug('');
    setDescription('');
    toast.success(`Category "${title}" created successfully.`);
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Blog & Publication Categories"
        description="Organize articles and whitepapers into logical taxonomies for site navigation."
        breadcrumbs={[{ label: 'Blogs', href: '/cms/blogs' }, { label: 'Categories' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-500" /> Add New Category
          </h3>

          <div>
            <Label htmlFor="catName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Category Name *
            </Label>
            <Input id="catName" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Artificial Intelligence" className="mt-1 text-xs" required />
          </div>

          <div>
            <Label htmlFor="catSlug" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Slug
            </Label>
            <Input id="catSlug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="artificial-intelligence" className="mt-1 text-xs font-mono" />
          </div>

          <div>
            <Label htmlFor="catDesc" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Description
            </Label>
            <textarea
              id="catDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief taxonomy overview..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Save Category
          </Button>
        </form>

        {/* Categories Grid List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5">
                    <Folder className="w-4 h-4" /> {cat.title}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/{cat.slug}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">{cat.description || 'No description provided.'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {cat.postsCount} articles
                </span>
                <button
                  onClick={() => {
                    deleteCategory(cat.id);
                    toast.success('Category removed');
                  }}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete Category"
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
