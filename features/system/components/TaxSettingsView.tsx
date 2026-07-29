'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge, Switch } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Modal } from '@/components/enterprise/InteractiveComponents';
import { TaxRule } from '@/features/system/types/systemTypes';
import { Receipt, Plus, Edit3, Trash2, ShieldCheck, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function TaxSettingsView() {
  const { taxRules, addTaxRule, updateTaxRule, deleteTaxRule } = useSystemStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<TaxRule | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState<string>(''); // Add globalFilter state

  const [region, setRegion] = React.useState('');
  const [country, setCountry] = React.useState('United States');
  const [taxName, setTaxName] = React.useState('');
  const [ratePercent, setRatePercent] = React.useState(8.5);
  const [isCompound, setIsCompound] = React.useState(false);
  const [vatGstNumber, setVatGstNumber] = React.useState('');
  const [appliesToShipping, setAppliesToShipping] = React.useState(true);

  const openAddModal = () => {
    setEditingRule(null);
    setRegion('');
    setCountry('United States');
    setTaxName('');
    setRatePercent(8.5);
    setIsCompound(false);
    setVatGstNumber('');
    setAppliesToShipping(true);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: TaxRule) => {
    setEditingRule(rule);
    setRegion(rule.region);
    setCountry(rule.country);
    setTaxName(rule.taxName);
    setRatePercent(rule.ratePercent);
    setIsCompound(rule.isCompound);
    setVatGstNumber(rule.vatGstNumber);
    setAppliesToShipping(rule.appliesToShipping);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!taxName || !region) {
      toast.error('Tax Name and Region/State are required');
      return;
    }

    if (editingRule) {
      updateTaxRule(editingRule.id, {
        region,
        country,
        taxName,
        ratePercent,
        isCompound,
        vatGstNumber,
        appliesToShipping,
      });
      toast.success('Tax rule updated');
    } else {
      addTaxRule({
        region,
        country,
        taxName,
        ratePercent,
        isCompound,
        vatGstNumber,
        appliesToShipping,
        status: 'ACTIVE',
      });
      toast.success('Tax rule added');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'taxName',
      header: 'Tax Rule Name',
      render: (row: TaxRule) => (
        <div>
          <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 block">{row.taxName}</span>
          <span className="text-xs text-slate-500 font-mono">{row.vatGstNumber || 'No Registration ID'}</span>
        </div>
      ),
    },
    {
      key: 'region',
      header: 'Jurisdiction',
      render: (row: TaxRule) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
          {row.region} ({row.country})
        </span>
      ),
    },
    {
      key: 'ratePercent',
      header: 'Tax Rate (%)',
      render: (row: TaxRule) => (
        <Badge variant="success" className="font-mono text-xs font-black">
          {row.ratePercent.toFixed(2)}%
        </Badge>
      ),
    },
    {
      key: 'appliesToShipping',
      header: 'Shipping Taxable',
      render: (row: TaxRule) => (
        <Badge variant={row.appliesToShipping ? 'info' : 'outline'}>
          {row.appliesToShipping ? 'YES' : 'NO'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: TaxRule) => (
        <Switch
          checked={row.status === 'ACTIVE'}
          onChange={(e) => {
            updateTaxRule(row.id, { status: e.target.checked ? 'ACTIVE' : 'INACTIVE' });
            toast.success(`Tax rule ${row.taxName} status changed`);
          }}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: TaxRule) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(row)}>
            <Edit3 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              deleteTaxRule(row.id);
              toast.success('Tax rule deleted');
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
            Tax Rates & Regional Compliance Nexus
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Define sales tax, VAT, GST calculation percentages, shipping taxability, and registration IDs
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Tax Jurisdiction
        </Button>
      </div>

      <Card>
        <EnterpriseTable
          data={taxRules}
          columns={columns}
          searchPlaceholder="Search tax rules or jurisdictions..."
          globalFilter={globalFilter} // Pass globalFilter
          setGlobalFilter={setGlobalFilter} // Pass setGlobalFilter
        />
      </Card>

      {/* Tax Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? 'Edit Tax Jurisdiction' : 'Add Tax Jurisdiction'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Tax Rule
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Tax Rule Title" placeholder="e.g. CA State Sales Tax" value={taxName} onChange={(e) => setTaxName(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Region / State" placeholder="e.g. California" value={region} onChange={(e) => setRegion(e.target.value)} />
            <Input label="Country" placeholder="e.g. United States" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              value={ratePercent}
              onChange={(e) => setRatePercent(parseFloat(e.target.value))}
            />
            <Input label="VAT / GST Registration ID" placeholder="VAT-DE-99812" value={vatGstNumber} onChange={(e) => setVatGstNumber(e.target.value)} />
          </div>

          <div className="space-y-3 pt-2">
            <Switch
              label="Tax Applies to Freight / Shipping Charges"
              checked={appliesToShipping}
              onChange={(e) => setAppliesToShipping(e.target.checked)}
            />
            <Switch
              label="Compound Tax Rate (Calculated on subtotal + prior taxes)"
              checked={isCompound}
              onChange={(e) => setIsCompound(e.target.checked)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
