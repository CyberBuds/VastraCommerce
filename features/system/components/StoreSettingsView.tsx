'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge, Switch } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { StoreSetting } from '@/features/system/types/systemTypes';
import { Store, Plus, Globe, CheckCircle, XCircle, Trash2, Edit3, DollarSign, Layers } from 'lucide-react';
import { toast } from 'sonner';

export function StoreSettingsView() {
  const { stores, addStoreSetting, updateStoreSetting, deleteStoreSetting } = useSystemStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingStore, setEditingStore] = React.useState<StoreSetting | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState<string>(''); // Add globalFilter state

  const [formCode, setFormCode] = React.useState('');
  const [formName, setFormName] = React.useState('');
  const [formDomain, setFormDomain] = React.useState('');
  const [formCurrency, setFormCurrency] = React.useState('USD');
  const [formLanguage, setFormLanguage] = React.useState('en-US');
  const [formStrategy, setFormStrategy] = React.useState<StoreSetting['inventoryStrategy']>('STRICT_ALLOCATION');
  const [formPhoneRequired, setFormPhoneRequired] = React.useState(true);
  const [formMinValue, setFormMinValue] = React.useState(25);

  const openAddModal = () => {
    setEditingStore(null);
    setFormCode(`STORE-${Math.floor(100 + Math.random() * 900)}`);
    setFormName('');
    setFormDomain('');
    setFormCurrency('USD');
    setFormLanguage('en-US');
    setFormStrategy('STRICT_ALLOCATION');
    setFormPhoneRequired(true);
    setFormMinValue(25);
    setIsModalOpen(true);
  };

  const openEditModal = (store: StoreSetting) => {
    setEditingStore(store);
    setFormCode(store.storeCode);
    setFormName(store.name);
    setFormDomain(store.domain);
    setFormCurrency(store.defaultCurrency);
    setFormLanguage(store.defaultLanguage);
    setFormStrategy(store.inventoryStrategy);
    setFormPhoneRequired(store.checkoutRequirePhone);
    setFormMinValue(store.minOrderValue);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formDomain) {
      toast.error('Store Name and Domain are required');
      return;
    }

    if (editingStore) {
      updateStoreSetting(editingStore.id, {
        storeCode: formCode,
        name: formName,
        domain: formDomain,
        defaultCurrency: formCurrency,
        defaultLanguage: formLanguage,
        inventoryStrategy: formStrategy,
        checkoutRequirePhone: formPhoneRequired,
        minOrderValue: formMinValue,
      });
      toast.success('Store configuration updated');
    } else {
      addStoreSetting({
        storeCode: formCode,
        name: formName,
        domain: formDomain,
        defaultCurrency: formCurrency,
        defaultLanguage: formLanguage,
        isActive: true,
        inventoryStrategy: formStrategy,
        checkoutRequirePhone: formPhoneRequired,
        minOrderValue: formMinValue,
      });
      toast.success('New store channel added');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'storeCode',
      header: 'Store Code',
      render: (row: StoreSetting) => (
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200">{row.storeCode}</span>
      ),
    },
    {
      key: 'name',
      header: 'Store Name & Domain',
      render: (row: StoreSetting) => (
        <div>
          <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 block">{row.name}</span>
          <span className="text-xs text-sky-600 dark:text-sky-400 font-mono flex items-center gap-1">
            <Globe className="w-3 h-3" /> {row.domain}
          </span>
        </div>
      ),
    },
    {
      key: 'defaultCurrency',
      header: 'Locale / Currency',
      render: (row: StoreSetting) => (
        <div className="text-xs">
          <Badge variant="outline" className="font-bold">
            {row.defaultCurrency}
          </Badge>
          <span className="ml-2 text-slate-500 font-mono">{row.defaultLanguage}</span>
        </div>
      ),
    },
    {
      key: 'inventoryStrategy',
      header: 'Fulfillment Strategy',
      render: (row: StoreSetting) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
          {row.inventoryStrategy.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row: StoreSetting) => (
        <Switch
          checked={row.isActive}
          onChange={(e) => {
            updateStoreSetting(row.id, { isActive: e.target.checked });
            toast.success(`Store ${row.name} status updated`);
          }}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: StoreSetting) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(row)}>
            <Edit3 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              deleteStoreSetting(row.id);
              toast.success('Store deleted');
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Multi-Store & Channel Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage store domains, local currencies, inventory allocation strategies, and checkout rules
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Store Channel
        </Button>
      </div>

      <Card>
        <EnterpriseTable
          data={stores}
          columns={columns}
          searchPlaceholder="Filter store channels..."
          globalFilter={globalFilter} // Pass globalFilter
          setGlobalFilter={setGlobalFilter} // Pass setGlobalFilter
        />
      </Card>

      {/* Store Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStore ? 'Edit Store Channel' : 'Create New Store Channel'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Channel
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Store Code" value={formCode} onChange={(e) => setFormCode(e.target.value)} />
            <Input label="Store Display Name" placeholder="e.g. EU Portal" value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>

          <Input label="Store Primary Domain" placeholder="eu.enterprise.aero" value={formDomain} onChange={(e) => setFormDomain(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Default Currency</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value)}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="SGD">SGD - Singapore Dollar</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Default Language</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={formLanguage}
                onChange={(e) => setFormLanguage(e.target.value)}
              >
                <option value="en-US">English (US)</option>
                <option value="de-DE">German (DE)</option>
                <option value="fr-FR">French (FR)</option>
                <option value="en-SG">English (SG)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Fulfillment Allocation Policy</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={formStrategy}
                onChange={(e) => setFormStrategy(e.target.value as any)}
              >
                <option value="STRICT_ALLOCATION">Strict Warehouse Allocation</option>
                <option value="MULTI_WAREHOUSE_FULFILLMENT">Multi-Warehouse Fulfillment</option>
                <option value="BACKORDER">Allow Backorder Allocation</option>
              </select>
            </div>

            <Input
              label="Min Order Value ($)"
              type="number"
              value={formMinValue}
              onChange={(e) => setFormMinValue(Number(e.target.value))}
            />
          </div>

          <Switch
            label="Require Phone Number at Checkout"
            checked={formPhoneRequired}
            onChange={(e) => setFormPhoneRequired(e.target.checked)}
          />
        </div>
      </Modal>
    </div>
  );
}
