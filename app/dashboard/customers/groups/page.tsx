'use client';

import * as React from 'react';
import { useCustomerGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from '@/hooks/useCustomers';
import { Badge, Button, Input } from '@/components/enterprise/BaseInputs';
import { Users, Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function CustomerGroupsPage() {
  const { data: groups = [], isLoading } = useCustomerGroups();
  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();

  // Form overlay state
  const [showForm, setShowForm] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<any | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    discountPercentage: '',
    description: '',
  });

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setFormData({ name: '', discountPercentage: '0', description: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (group: any) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      discountPercentage: group.discountPercentage.toString(),
      description: group.description || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = parseFloat(formData.discountPercentage);
    if (isNaN(discount) || discount < 0 || discount > 100) return;

    if (editingGroup) {
      updateGroupMutation.mutate({
        id: editingGroup.id,
        data: {
          name: formData.name,
          discountPercentage: discount,
          description: formData.description,
        },
      }, {
        onSuccess: () => setShowForm(false)
      });
    } else {
      createGroupMutation.mutate({
        code: `g-${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: formData.name,
        discountPercentage: discount,
        description: formData.description,
      }, {
        onSuccess: () => setShowForm(false)
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'g-default') {
      alert('The Default Tier cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete the "${name}" customer tier?`)) {
      deleteGroupMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6" id="customer-groups-page-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-slate-800" />
            Pricing Groups & Loyalty Tiers
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Define flat percentage discounts automatically applied on checkout pipelines based on user pricing bands.
          </p>
        </div>
        <div>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" /> Launch Loyalty Tier
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-2">
          <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent animate-spin rounded-full" />
          <span className="text-xs text-slate-400 font-mono">Loading active groups...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-slate-900 dark:text-zinc-50 text-sm">
                    {group.name}
                  </h3>
                  <Badge variant={group.discountPercentage > 10 ? 'success' : 'neutral'} className="font-mono text-xs">
                    {group.discountPercentage}% flat discount
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {group.description || 'Flat pricing tier group for specific catalog purchase lanes.'}
                </p>
                <span className="text-[10px] text-slate-400 font-mono block">Code: {group.code}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-end gap-2 text-xs">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenEdit(group)}
                  title="Edit Group"
                >
                  <Edit2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                </Button>
                {group.id !== 'g-default' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600"
                    onClick={() => handleDelete(group.id, group.name)}
                    title="Delete Group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
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
                {editingGroup ? 'Modify pricing tier' : 'Configure New Pricing Tier'}
              </h4>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <Input
                label="Tier Name *"
                required
                placeholder="e.g. VIP B2B Tier"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              />

              <Input
                label="Percentage Discount (%) *"
                required
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 15"
                value={formData.discountPercentage}
                onChange={(e) => setFormData(p => ({ ...p, discountPercentage: e.target.value }))}
              />

              <Input
                label="Description"
                placeholder="Describe rules or enrollment threshold..."
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" isLoading={createGroupMutation.isPending || updateGroupMutation.isPending}>
                <Check className="w-4 h-4 mr-1.5" /> Save Pricing Tier
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
