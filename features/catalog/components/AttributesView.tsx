'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Search, GitBranch, Palette, Image as ImageIcon, Type, Trash2, Edit } from 'lucide-react';
import { useCatalogStore, Attribute, AttributeGroup } from '@/store/catalogStore';
import { attributeGroupService, attributeService, attributeValueService } from '@/services/catalogMasterService';
import { toast } from 'sonner';

export function AttributesView() {
  const { attributeGroups, attributes, addAttributeGroup, addAttribute, updateAttribute, deleteAttribute } =
    useCatalogStore();

  const [activeTab, setActiveTab] = useState<'attributes' | 'groups'>('attributes');
  const [isOpen, setIsOpen] = useState(false);
  const [editingAttrId, setEditingAttrId] = useState<string | null>(null);
  const [isSavingAttribute, setIsSavingAttribute] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  // Attr Form state
  const [attrForm, setAttrForm] = useState<{
    groupId: string;
    name: string;
    type: 'text' | 'color' | 'image';
    values: { id: string; value: string; label: string; extra?: string }[];
  }>({
    groupId: attributeGroups[0]?.id || 'g-1',
    name: '',
    type: 'text',
    values: [{ id: 'v-1', value: 'std', label: 'Standard' }],
  });

  // New Group Form
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleAddValueRow = () => {
    setAttrForm((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        { id: `v-${Date.now()}`, value: '', label: '', extra: prev.type === 'color' ? '#3b82f6' : '' },
      ],
    }));
  };

  const handleValueChange = (index: number, field: string, val: string) => {
    setAttrForm((prev) => {
      const updated = [...prev.values];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, values: updated };
    });
  };

  const handleSubmitAttr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrForm.name.trim()) return;

    setIsSavingAttribute(true);
    try {
      const slug = attrForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        name: attrForm.name.trim(),
        code: `ATTRIBUTE-${slug.toUpperCase()}`,
        slug,
        status: 'ACTIVE' as const,
        isActive: true,
        groupId: /^\d+$/.test(attrForm.groupId) ? Number(attrForm.groupId) : undefined,
      };
      if (editingAttrId) {
        await attributeService.update(editingAttrId, payload);
        updateAttribute(editingAttrId, attrForm);
        toast.success('Attribute set updated');
      } else {
        const response = await attributeService.create(payload);
        const attributeId = String(response.data.id);
        const values = await Promise.all(attrForm.values.map(async (value) => {
          const saved = await attributeValueService.create(attributeId, {
            value: value.label.trim() || value.value.trim(),
            code: value.value.trim() || undefined,
            slug: (value.label || value.value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || undefined,
            extra: value.extra || undefined,
            status: 'ACTIVE',
            isActive: true,
          });
          return { ...value, id: String(saved.data.id) };
        }));
        addAttribute({ ...attrForm, id: attributeId, createdAt: response.data.createdAt, values });
        toast.success('New product attribute registered');
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to save the attribute.' : 'Unable to save the attribute.');
    } finally {
      setIsSavingAttribute(false);
    }
  };

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsSavingGroup(true);
    try {
      const slug = groupName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const response = await attributeGroupService.create({
        name: groupName.trim(), code: `GROUP-${slug.toUpperCase()}`, slug, description: groupDesc || undefined, status: 'ACTIVE', isActive: true,
      });
      addAttributeGroup({ name: groupName, description: groupDesc, id: String(response.data.id) });
      toast.success('Attribute group created');
      setGroupName('');
      setGroupDesc('');
      setIsGroupModalOpen(false);
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to save the attribute group.' : 'Unable to save the attribute group.');
    } finally {
      setIsSavingGroup(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            Product Attributes & Custom Fields
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Color swatches, image swatches, text dimensions, and attribute group classifications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <Plus className="h-4 w-4" /> Add Group
          </button>
          <button
            onClick={() => {
              setEditingAttrId(null);
              setAttrForm({
                groupId: attributeGroups[0]?.id || 'g-1',
                name: '',
                type: 'text',
                values: [{ id: 'v-1', value: '', label: '' }],
              });
              setIsOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add Attribute
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('attributes')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'attributes' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent'
          }`}
        >
          Attributes Registry ({attributes.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'groups' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent'
          }`}
        >
          Attribute Groups ({attributeGroups.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'attributes' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {attributes.map((a) => {
            const groupName = attributeGroups.find((g) => g.id === a.groupId)?.name || 'General';
            return (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {groupName}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                    {a.type === 'color' && <Palette className="h-3 w-3" />}
                    {a.type === 'image' && <ImageIcon className="h-3 w-3" />}
                    {a.type === 'text' && <Type className="h-3 w-3" />}
                    {a.type} Swatch
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{a.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.values.map((v) => (
                      <div
                        key={v.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        {a.type === 'color' && (
                          <span
                            className="h-3 w-3 rounded-full border border-slate-300"
                            style={{ backgroundColor: v.extra || '#000' }}
                          />
                        )}
                        <span>{v.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                  <button
                    onClick={async () => {
                      if (confirm(`Delete attribute ${a.name}?`)) {
                        try {
                          await attributeService.delete(a.id);
                          deleteAttribute(a.id);
                          toast.success('Attribute deleted');
                        } catch (error) {
                          toast.error(axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to delete the attribute.' : 'Unable to delete the attribute.');
                        }
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {attributeGroups.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-2"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{g.name}</h3>
              <p className="text-xs text-slate-500">{g.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Attribute */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              {editingAttrId ? 'Edit Attribute' : 'New Attribute Specification'}
            </h2>

            <form onSubmit={handleSubmitAttr} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Group</label>
                  <select
                    value={attrForm.groupId}
                    onChange={(e) => setAttrForm({ ...attrForm, groupId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                  >
                    {attributeGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Swatch Display Type</label>
                  <select
                    value={attrForm.type}
                    onChange={(e) =>
                      setAttrForm({ ...attrForm, type: e.target.value as 'text' | 'color' | 'image' })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                  >
                    <option value="text">Text Badge</option>
                    <option value="color">Color Hex Swatch</option>
                    <option value="image">Image Tile</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Attribute Name</label>
                <input
                  type="text"
                  required
                  value={attrForm.name}
                  onChange={(e) => setAttrForm({ ...attrForm, name: e.target.value })}
                  placeholder="e.g. Build Size or Thermal Coating"
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>

              {/* Values List */}
              <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">Attribute Values & Swatches</span>
                  <button
                    type="button"
                    onClick={handleAddValueRow}
                    className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    + Add Value Row
                  </button>
                </div>

                {attrForm.values.map((v, idx) => (
                  <div key={v.id || idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Label (e.g. Compact)"
                      value={v.label}
                      onChange={(e) => handleValueChange(idx, 'label', e.target.value)}
                      className="col-span-6 rounded-lg border border-slate-200 p-2 text-xs text-slate-900 dark:border-zinc-800 dark:text-zinc-100"
                    />
                    {attrForm.type === 'color' ? (
                      <input
                        type="color"
                        value={v.extra || '#000000'}
                        onChange={(e) => handleValueChange(idx, 'extra', e.target.value)}
                        className="col-span-4 h-8 w-full cursor-pointer rounded border border-slate-200 p-0.5"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Key code / extra"
                        value={v.value}
                        onChange={(e) => handleValueChange(idx, 'value', e.target.value)}
                        className="col-span-4 rounded-lg border border-slate-200 p-2 text-xs text-slate-900 dark:border-zinc-800 dark:text-zinc-100"
                      />
                    )}
                  </div>
                ))}
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
                  disabled={isSavingAttribute}
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                >
                  {isSavingAttribute ? 'Saving...' : 'Save Attribute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Create Attribute Group</h2>
            <form onSubmit={handleSubmitGroup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Group Title</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Physical Specs"
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-xs text-slate-900 outline-none dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGroup}
                  className="rounded-xl bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700"
                >
                  {isSavingGroup ? 'Saving...' : 'Save Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
