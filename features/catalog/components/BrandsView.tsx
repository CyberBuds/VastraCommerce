'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Tag, Globe, Sparkles, Trash2, Edit, CheckCircle, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { useCatalogStore, CatalogBrand } from '@/store/catalogStore';
import { brandService } from '@/services/brandService';
import { toast } from 'sonner';

export function BrandsView() {
  const { brands, addBrand, updateBrand, deleteBrand, replaceBrands } = useCatalogStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    logo: string;
    banner: string;
    description: string;
    featured: boolean;
    seoTitle: string;
    seoDescription: string;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    name: '',
    logo: '',
    banner: '',
    description: '',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    brandService.list()
      .then((response) => replaceBrands(response.data.items.map((brand) => ({
        ...brand,
        id: String(brand.id),
        logo: brand.image || '',
        banner: '',
        featured: false,
      }))));
  }, [replaceBrands]);

  const filtered = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      logo: '',
      banner: '',
      description: '',
      featured: false,
      seoTitle: '',
      seoDescription: '',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: CatalogBrand) => {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      logo: brand.logo,
      banner: brand.banner || '',
      description: brand.description,
      featured: brand.featured,
      seoTitle: brand.seoTitle || '',
      seoDescription: brand.seoDescription || '',
      status: brand.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    setIsSaving(true);
    try {
      const slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const payload = {
        name: form.name.trim(),
        code: `BRAND-${slug.toUpperCase()}`,
        slug,
        description: form.description || undefined,
        image: form.logo || undefined,
        status: form.status,
        isActive: form.status === 'ACTIVE',
      };

      if (editingId) {
        await brandService.update(editingId, payload);
        updateBrand(editingId, form);
        toast.success('Brand details updated successfully');
      } else {
        const response = await brandService.create(payload);
        addBrand({ ...form, id: String(response.data.id), createdAt: response.data.createdAt });
        toast.success('New brand added to corporate registry');
      }
      setIsModalOpen(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Unable to save the brand. Please try again.'
        : 'Unable to save the brand. Please try again.';
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
            Brand Management Directory
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Corporate brand registry, logos, banners, SEO metadata, and featured sponsorships
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Brand Node
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands by commercial label or description..."
          className="w-full bg-transparent text-xs text-slate-900 outline-none dark:text-zinc-100"
        />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              {/* Banner */}
              <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
                {b.banner ? (
                  <img src={b.banner} alt={b.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-slate-800 to-indigo-950" />
                )}
                {b.featured && (
                  <span className="absolute top-2 right-2 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Logo & Content */}
              <div className="p-5 pt-0 relative">
                <div className="-mt-8 mb-3 flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl border-2 border-white bg-white p-1 shadow-md dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <img src={b.logo} alt={b.name} className="h-full w-full rounded-xl object-cover" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      b.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{b.name}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{b.description}</p>

                {b.seoTitle && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[10px] text-slate-600 dark:bg-zinc-950 dark:text-zinc-400 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{b.seoTitle}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(b)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Remove brand ${b.name}?`)) {
                    try {
                      await brandService.delete(b.id);
                      deleteBrand(b.id);
                      toast.success('Brand removed');
                    } catch (error) {
                      const message = axios.isAxiosError(error)
                        ? error.response?.data?.message || 'Unable to remove the brand. Please try again.'
                        : 'Unable to remove the brand. Please try again.';
                      toast.error(message);
                    }
                  }
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              {editingId ? 'Edit Brand Details' : 'Register New Corporate Brand'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. AeroSpace Inc"
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Logo URL</label>
                  <input
                    type="text"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Banner URL</label>
                  <input
                    type="text"
                    value={form.banner}
                    onChange={(e) => setForm({ ...form, banner: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Brand Overview</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Brand mission and manufacturing line specifications..."
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="Meta Title"
                    className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="feat-brand"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="feat-brand" className="font-semibold text-slate-700 dark:text-zinc-300">
                  Highlight as Featured Brand Partner
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                >
                  {isSaving ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
