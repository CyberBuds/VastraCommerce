'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Search, Tag as TagIcon, Trash2, Edit } from 'lucide-react';
import { useCatalogStore, CatalogTag } from '@/store/catalogStore';
import { tagService } from '@/services/tagService';
import { toast } from 'sonner';

export function TagsView() {
  const { tags, addTag, updateTag, deleteTag } = useCatalogStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    name: '',
    status: 'ACTIVE',
  });

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ name: '', status: 'ACTIVE' });
    setIsOpen(true);
  };

  const handleOpenEdit = (t: CatalogTag) => {
    setEditingId(t.id);
    setForm({ name: t.name, status: t.status });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSaving(true);
    try {
      const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        name: form.name.trim(),
        code: `TAG-${slug.toUpperCase()}`,
        slug,
        status: form.status,
        isActive: form.status === 'ACTIVE',
      };

      if (editingId) {
        await tagService.update(editingId, payload);
        updateTag(editingId, form);
        toast.success('Tag updated');
      } else {
        const response = await tagService.create(payload);
        addTag({ ...form, id: String(response.data.id), createdAt: response.data.createdAt });
        toast.success('New catalog search tag created');
      }
      setIsOpen(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Unable to save the tag. Please try again.'
        : 'Unable to save the tag. Please try again.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            Search & Taxonomy Tags Directory
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Product search keywords, automatic indexing filters, and customer discovery tags
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Create Search Tag
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter search tags..."
          className="w-full bg-transparent text-xs text-slate-900 outline-none dark:text-zinc-100"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2 min-w-0">
              <TagIcon className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="truncate text-xs font-bold text-slate-800 dark:text-zinc-200">{t.name}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleOpenEdit(t)}
                className="p-1 text-slate-400 hover:text-indigo-600"
                title="Edit"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={async () => {
                  try {
                    await tagService.delete(t.id);
                    deleteTag(t.id);
                    toast.success('Tag deleted');
                  } catch (error) {
                    const message = axios.isAxiosError(error)
                      ? error.response?.data?.message || 'Unable to delete the tag. Please try again.'
                      : 'Unable to delete the tag. Please try again.';
                    toast.error(message);
                  }
                }}
                className="p-1 text-slate-400 hover:text-rose-600"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 shadow-xl space-y-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              {editingId ? 'Edit Tag' : 'New Tag Keyword'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Tag Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.toLowerCase().trim() })}
                  placeholder="e.g. aerospace"
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700"
                >
                  {isSaving ? 'Saving...' : 'Save Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
