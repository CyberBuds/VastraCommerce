'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge, Switch } from '@/components/enterprise/BaseInputs';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { FeatureFlag, FeatureFlagStatus, SystemRoleType } from '@/features/system/types/systemTypes';
import { Zap, Plus, Edit3, ShieldAlert, Sliders, CheckCircle2, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';

export function FeatureFlagsView() {
  const { featureFlags, toggleFeatureFlag, updateFeatureFlag, addFeatureFlag } = useSystemStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [key, setKey] = React.useState('');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [module, setModule] = React.useState('Catalog');
  const [rolloutPercentage, setRolloutPercentage] = React.useState(100);

  const handleCreateFlag = () => {
    if (!key || !name) {
      toast.error('Flag Key and Name are required');
      return;
    }
    addFeatureFlag({
      key: key.toUpperCase().replace(/\s+/g, '_'),
      name,
      description,
      status: 'ENABLED',
      rolloutPercentage,
      targetRoles: ['SUPER_ADMIN', 'ADMIN'],
      module,
      updatedBy: 'Current Administrator',
    });
    toast.success('Feature Flag Created', {
      description: 'Propagating flag rules to client components instantly.',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Feature Flags & Dynamic Rollout Toggles
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage progressive canary feature rollouts, percentage sliders, targeted role access, and emergency module kill switches
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Feature Flag
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {featureFlags.map((flag) => (
          <Card key={flag.id} className="border-l-4 border-l-amber-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                    {flag.key}
                  </span>
                  <Badge variant={flag.status === 'ENABLED' ? 'success' : flag.status === 'BETA_ROLLOUT' ? 'warning' : 'danger'}>
                    {flag.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-400">Module: {flag.module}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">{flag.name}</h3>
                <p className="text-xs text-slate-500">{flag.description}</p>

                {/* Percentage Rollout Slider */}
                <div className="pt-2 flex items-center gap-4 max-w-md">
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                    Rollout: {flag.rolloutPercentage}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={flag.rolloutPercentage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateFeatureFlag(flag.id, { rolloutPercentage: val });
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={flag.status === 'ENABLED' || flag.status === 'BETA_ROLLOUT'}
                  onChange={() => {
                    toggleFeatureFlag(flag.id);
                    toast.success(`Flag ${flag.key} updated`);
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New Flag Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create System Feature Flag"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateFlag}>
              Save Flag
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Flag Constant Key" placeholder="ENABLE_NEW_CHECKOUT_FLOW" value={key} onChange={(e) => setKey(e.target.value)} className="font-mono" />
          <Input label="Display Title" placeholder="New Single-Step Checkout" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Description" placeholder="Replaces legacy multi-page cart checkout" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Target Module</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              >
                <option value="Catalog">Catalog</option>
                <option value="Inventory">Inventory</option>
                <option value="Orders">Orders</option>
                <option value="Payments">Payments</option>
                <option value="System">System</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Initial Rollout (%)</label>
              <Input type="number" min="0" max="100" value={rolloutPercentage} onChange={(e) => setRolloutPercentage(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
