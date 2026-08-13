'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown, Folder, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Sparkles, Sliders, Globe, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { Select } from '@/components/enterprise/InteractiveComponents';
import { useDialog } from '@/hooks/useDialog';
import { toast } from 'sonner';
import { api } from '@/services/api';

export interface CategoryNode {
  id: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string;
  banner?: string;
  seoTitle?: string;
  seoDescription?: string;
  children?: CategoryNode[];
}

interface CategoryTreeViewProps {
  categories: CategoryNode[];
  onUpdate: (categories: CategoryNode[]) => void;
}

export function CategoryTreeView({ categories, onUpdate }: CategoryTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({
    'cat-1': true,
    'cat-2': true,
  });
  const [imageUrl, setImageUrl] = React.useState('');
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const categoryDialog = useDialog<{ parentId?: string; node?: CategoryNode }>();

  const uploadCategoryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'categories');
      const response = await api.post('/media/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImageUrl(response.data.data.publicUrl);
      toast.success('Category image uploaded successfully.');
    } catch {
      toast.error('Category image upload failed.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to deep traverse and modify node
  const traverseAndModify = (
    nodes: CategoryNode[],
    id: string,
    action: 'add' | 'edit' | 'delete' | 'move_up' | 'move_down',
    payload?: any
  ): CategoryNode[] => {
    if (action === 'delete') {
      return nodes
        .filter(n => n.id !== id)
        .map(n => ({
          ...n,
          children: n.children ? traverseAndModify(n.children, id, action) : undefined,
        }));
    }

    if (action === 'move_up' || action === 'move_down') {
      const idx = nodes.findIndex(n => n.id === id);
      if (idx !== -1) {
        const targetIdx = action === 'move_up' ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < nodes.length) {
          const res = [...nodes];
          const temp = res[idx];
          res[idx] = res[targetIdx];
          res[targetIdx] = temp;
          return res;
        }
        return nodes;
      }
      return nodes.map(n => ({
        ...n,
        children: n.children ? traverseAndModify(n.children, id, action) : undefined,
      }));
    }

    return nodes.map(node => {
      if (node.id === id) {
        if (action === 'edit') {
          return { ...node, ...payload };
        }
        if (action === 'add') {
          const newChildren = [...(node.children || []), payload];
          return { ...node, children: newChildren };
        }
      }
      return {
        ...node,
        children: node.children ? traverseAndModify(node.children, id, action, payload) : undefined,
      };
    });
  };

  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const categoryPayload = (values: { name: string; code: string; status: 'ACTIVE' | 'INACTIVE'; image: string }) => ({
    name: values.name,
    code: values.code,
    status: values.status,
    image: values.image || undefined,
    slug: slugify(values.name),
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const formVals = {
      name: fd.get('name') as string,
      code: fd.get('code') as string,
      status: fd.get('status') as 'ACTIVE' | 'INACTIVE',
      image: imageUrl || categoryDialog.data?.node?.image || '',
      banner: fd.get('banner') as string,
      seoTitle: fd.get('seoTitle') as string,
      seoDescription: fd.get('seoDescription') as string,
    };

    if (!formVals.name || !formVals.code) {
      toast.error('Validation Error', { description: 'Please provide Category Name and Code' });
      return;
    }

    try {
    if (categoryDialog.data?.node) {
      const saved = await api.put(`/master/categories/${categoryDialog.data.node.id}`, {
        ...categoryPayload(formVals),
      });
      onUpdate(traverseAndModify(categories, categoryDialog.data.node.id, 'edit', saved.data.data));
      toast.success('Category properties synchronized.');
    } else if (categoryDialog.data?.parentId) {
      const saved = await api.post('/master/sub-categories', {
        ...categoryPayload(formVals),
        categoryId: Number(categoryDialog.data.parentId),
      });
      const newChild: CategoryNode = { ...saved.data.data, id: String(saved.data.data.id), children: [] };
      const updated = traverseAndModify(categories, categoryDialog.data.parentId, 'add', newChild);
      onUpdate(updated);
      setExpandedNodes(prev => ({ ...prev, [categoryDialog.data!.parentId!]: true }));
      toast.success('Sub-category registered successfully!');
    } else {
      const saved = await api.post('/master/categories', {
        ...categoryPayload(formVals),
      });
      onUpdate([...categories, { ...saved.data.data, id: String(saved.data.data.id), children: [] }]);
      toast.success('Root category registered successfully!');
    }

    categoryDialog.close();
    } catch {
    toast.error('Category could not be saved to the database.');
  }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category and all its sub-categories?')) {
      try {
        const isSubCategory = categories.some((category) => category.children?.some((child) => child.id === id));
        await api.delete(isSubCategory ? `/master/sub-categories/${id}` : `/master/categories/${id}`);
        onUpdate(traverseAndModify(categories, id, 'delete'));
        toast.info('Category branch deleted from catalog.');
      } catch {
        toast.error('Category could not be deleted from the database.');
      }
    }
  };

  const handleMove = (id: string, direction: 'move_up' | 'move_down') => {
    const updated = traverseAndModify(categories, id, direction);
    onUpdate(updated);
    toast.success('Category order re-sequenced.');
  };

  // Render a recursive category row
  const renderCategoryRow = (node: CategoryNode, depth = 0) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={cn(
            'flex items-center justify-between py-2 px-3.5 rounded-xl border border-slate-100 dark:border-zinc-850/60 bg-white dark:bg-zinc-900 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all group',
            depth > 0 ? 'ml-6 border-l-2 border-l-slate-200 dark:border-l-zinc-800' : ''
          )}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn('p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800', !hasChildren && 'opacity-0 cursor-default')}
              onClick={() => hasChildren && toggleExpand(node.id)}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <Folder className="w-4 h-4 text-brand/80 dark:text-brand" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">{node.name}</span>
              <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded-md">
                {node.code}
              </span>
              <Badge variant={node.status === 'ACTIVE' ? 'success' : 'neutral'} className="text-[9px] py-0">
                {node.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => handleMove(node.id, 'move_up')}
              title="Move Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => handleMove(node.id, 'move_down')}
              title="Move Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-850 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => categoryDialog.open({ parentId: node.id })}
              title="Add Sub-category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-850 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => categoryDialog.open({ node })}
              title="Edit Properties"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
              onClick={() => handleDelete(node.id)}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Render nested children */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map(child => renderCategoryRow(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4" id="category-tree-view">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 p-4 rounded-xl">
        <div>
          <h2 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
            Nested Catalog Hierarchy
          </h2>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            Expand, contract, re-sequence, or edit category nodes.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="font-bold text-xs"
          onClick={() => categoryDialog.open({})}
          icon={Plus}
        >
          Add Root Category
        </Button>
      </div>

      <div className="space-y-2 min-h-[300px]">
        {categories.length > 0 ? (
          categories.map(root => renderCategoryRow(root, 0))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
            No category taxonomy found. Register a root category to start.
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      {categoryDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand" />
                {categoryDialog.data?.node
                  ? `Edit Taxonomy: ${categoryDialog.data.node.name}`
                  : categoryDialog.data?.parentId
                  ? 'Register Sub-category'
                  : 'Register Root Category'}
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                onClick={categoryDialog.close}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Category Name"
                name="name"
                defaultValue={categoryDialog.data?.node?.name || ''}
                required
                placeholder="Turbine Systems"
                id="cat-form-name"
              />
              <Input
                label="Code Prefix"
                name="code"
                defaultValue={categoryDialog.data?.node?.code || ''}
                required
                placeholder="TURB"
                id="cat-form-code"
              />
            </div>

            <Select
              label="Taxonomy Status"
              name="status"
              defaultValue={categoryDialog.data?.node?.status || 'ACTIVE'}
              options={[
                { value: 'ACTIVE', label: 'Active - Visible in storefront catalogs' },
                { value: 'INACTIVE', label: 'Inactive - Hidden taxonomy node' },
              ]}
              id="cat-form-status"
            />

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Image</span>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-4 text-xs font-bold text-slate-500 hover:border-brand hover:text-brand dark:border-zinc-700">
                <Upload className="h-4 w-4" />
                {uploadingImage ? 'Uploading image…' : 'Choose an image to upload'}
                <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={uploadCategoryImage} />
              </label>
              {(imageUrl || categoryDialog.data?.node?.image) && (
                <img src={imageUrl || categoryDialog.data?.node?.image} alt="Category preview" className="h-28 w-28 rounded-lg border border-slate-200 object-cover" />
              )}
            </div>

            <div className="space-y-2 border-t border-slate-100 dark:border-zinc-850 pt-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-brand" /> SEO Meta Overrides
              </span>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SEO Overridden Title"
                  name="seoTitle"
                  defaultValue={categoryDialog.data?.node?.seoTitle || ''}
                  placeholder="Buy Turbine Systems | Aero Enterprise"
                  id="cat-form-seo-title"
                />
                <Input
                  label="SEO Overridden Description"
                  name="seoDescription"
                  defaultValue={categoryDialog.data?.node?.seoDescription || ''}
                  placeholder="Browse complete inventory of custom-balanced extreme tolerance turbines..."
                  id="cat-form-seo-desc"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" onClick={categoryDialog.close}>
                Discard
              </Button>
              <Button type="submit" variant="primary">
                {categoryDialog.data?.node ? 'Save Taxonomic Updates' : 'Publish taxonomy item'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
