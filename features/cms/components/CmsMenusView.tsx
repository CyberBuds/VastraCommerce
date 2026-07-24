'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { Menu, Plus, Trash2, Move, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function CmsMenusView() {
  const { menus, addMenu, updateMenu } = useCmsStore();
  const [selectedMenuId, setSelectedMenuId] = React.useState(menus[0]?.id || '');
  const activeMenu = menus.find((m) => m.id === selectedMenuId) || menus[0];

  const [newItemTitle, setNewItemTitle] = React.useState('');
  const [newItemUrl, setNewItemUrl] = React.useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle || !newItemUrl || !activeMenu) return;

    const updatedItems = [
      ...activeMenu.items,
      {
        id: `mi-${Date.now()}`,
        title: newItemTitle,
        url: newItemUrl,
        target: '_self' as const,
        order: activeMenu.items.length + 1,
      },
    ];

    updateMenu(activeMenu.id, { items: updatedItems });
    setNewItemTitle('');
    setNewItemUrl('');
    toast.success('Added menu item!');
  };

  const removeItem = (itemId: string) => {
    if (!activeMenu) return;
    const updatedItems = activeMenu.items.filter((i) => i.id !== itemId);
    updateMenu(activeMenu.id, { items: updatedItems });
    toast.success('Removed menu item');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Navigation & Menu Hierarchy Builder"
        description="Configure header navbar links, mega-menus, footer link trees, and mobile navigation."
        breadcrumbs={[{ label: 'Menus' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Selector & Add Link Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2">
              Select Menu Location
            </h3>

            <div>
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Active Menu</Label>
              <Select
                value={selectedMenuId}
                onChange={(e) => setSelectedMenuId(e.target.value)}
                className="mt-1 text-xs font-bold"
              >
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.location})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <form onSubmit={handleAddItem} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" /> Add Custom Menu Link
            </h3>

            <div>
              <Label htmlFor="itemTitle" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Link Label *
              </Label>
              <Input id="itemTitle" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} placeholder="e.g. Products & Solutions" className="mt-1 text-xs" required />
            </div>

            <div>
              <Label htmlFor="itemUrl" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Destination URL *
              </Label>
              <Input id="itemUrl" value={newItemUrl} onChange={(e) => setNewItemUrl(e.target.value)} placeholder="e.g. /solutions or https://..." className="mt-1 text-xs font-mono" required />
            </div>

            <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
              <Plus className="w-4 h-4" /> Add to Menu
            </Button>
          </form>
        </div>

        {/* Menu Items List Tree */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{activeMenu?.name} Link Structure</h3>
              <p className="text-xs text-slate-400">Reorder or modify link targets for {activeMenu?.location}</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {activeMenu?.items.length} items
            </span>
          </div>

          <div className="space-y-2">
            {activeMenu?.items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <Move className="w-4 h-4 text-slate-400 cursor-grab" />
                  <span className="w-5 text-xs font-mono font-bold text-slate-400">{idx + 1}.</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{item.title}</p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-slate-400" /> {item.url}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
