'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Tag, Trash2, Edit } from 'lucide-react';
import { useCatalogStore, ProductType } from '@/store/catalogStore';
import { productTypeService } from '@/services/catalogMasterService';
import { toast } from 'sonner';

export function ProductTypesView() {
  const { productTypes, addProductType, updateProductType, deleteProductType, replaceProductTypes } = useCatalogStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    productTypeService.list().then((response) => replaceProductTypes(response.data.items.map((item) => ({
      id: String(item.id), name: item.name, description: item.description || '', createdAt: item.createdAt,
    }))));
  }, [replaceProductTypes]);

  const filtered = productTypes.filter(
    (pt) =>
      pt.name.toLowerCase().includes(search.toLowerCase()) ||
      pt.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setIsOpen(true);
  };

  const handleOpenEdit = (pt: ProductType) => {
    setEditingId(pt.id);
    setForm({ name: pt.name, description: pt.description });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSaving(true);
    try {
      const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = { ...form, name: form.name.trim(), code: `TYPE-${slug.toUpperCase()}`, slug, status: 'ACTIVE' as const, isActive: true };
      if (editingId) {
        await productTypeService.update(editingId, payload);
        updateProductType(editingId, form);
        toast.success('Product type updated');
      } else {
        const response = await productTypeService.create(payload);
        addProductType({ ...form, id: String(response.data.id), createdAt: response.data.createdAt });
        toast.success('New product type registered');
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to save the product type.' : 'Unable to save the product type.');
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
            Product Types & Templates
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Define architectural rules, shipping guidelines, and regulatory templates per item class
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add Product Type
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product types..."
          className="w-full bg-transparent text-xs text-slate-900 outline-none dark:text-zinc-100"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pt) => (
          <div
            key={pt.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400">{pt.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{pt.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{pt.description}</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => handleOpenEdit(pt)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Delete product type ${pt.name}?`)) {
                    try {
                      await productTypeService.delete(pt.id);
                      deleteProductType(pt.id);
                      toast.success('Product type removed');
                    } catch (error) {
                      toast.error(axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to delete the product type.' : 'Unable to delete the product type.');
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              {editingId ? 'Edit Product Type' : 'New Product Type'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Type Label</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Heavy Industrial Assembly"
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                >
                  {isSaving ? 'Saving...' : 'Save Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
