'use client';

import * as React from 'react';
import { useReportsStore } from '@/store/reportsStore';
import { ReportsHeader } from './ReportsHeader';
import { ReportExportModal } from './ReportExportModal';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { SlidersHorizontal, Plus, Save, Copy, Trash2, Eye, Check, Layers } from 'lucide-react';
import { toast } from 'sonner';

const AVAILABLE_FIELDS = {
  SALES: ['orderNumber', 'customerName', 'productName', 'sku', 'category', 'grossRevenue', 'netSales', 'discounts', 'taxAmount', 'orderDate'],
  ORDERS: ['orderNumber', 'orderStatus', 'customerGroup', 'paymentGateway', 'shippingCourier', 'itemsCount', 'orderTotal', 'creationDate'],
  CUSTOMERS: ['customerName', 'email', 'customerGroup', 'totalOrders', 'totalSpent', 'ltv', 'registrationDate', 'lastOrderDate'],
  INVENTORY: ['sku', 'productName', 'category', 'warehouse', 'stockOnHand', 'reservedStock', 'unitCost', 'retailPrice', 'totalValuation'],
  FINANCE: ['invoiceNumber', 'accountName', 'invoiceDate', 'dueDate', 'taxableBasis', 'taxCollected', 'paymentStatus'],
};

export function CustomReportBuilderView() {
  const { customTemplates, addTemplate, deleteTemplate, duplicateTemplate, openExportModal } = useReportsStore();

  const [selectedModule, setSelectedModule] = React.useState<'SALES' | 'ORDERS' | 'CUSTOMERS' | 'INVENTORY' | 'FINANCE'>('SALES');
  const [reportTitle, setReportTitle] = React.useState('');
  const [reportDesc, setReportDesc] = React.useState('');
  const [selectedFields, setSelectedFields] = React.useState<string[]>(['orderNumber', 'customerName', 'grossRevenue', 'orderDate']);
  const [groupBy, setGroupBy] = React.useState('category');
  const [sortBy, setSortBy] = React.useState('grossRevenue');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [aggregation, setAggregation] = React.useState<'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN'>('SUM');

  const availableForModule = AVAILABLE_FIELDS[selectedModule] || [];

  const handleToggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((f) => f !== field));
      } else {
        toast.error('At least one field must be selected for report output.');
      }
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      toast.error('Please enter a template title.');
      return;
    }

    addTemplate({
      title: reportTitle,
      description: reportDesc || 'Custom user-built analytics template',
      module: selectedModule,
      selectedFields,
      groupBy,
      sortBy,
      sortOrder,
      aggregation,
    });

    toast.success(`Template "${reportTitle}" saved to custom library!`);
    setReportTitle('');
    setReportDesc('');
  };

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Custom Report Builder & Query Architect"
        description="Design bespoke report queries, select data attributes, configure grouping & aggregation math, and save re-usable reporting templates."
        breadcrumbs={[{ label: 'Custom Builder' }]}
        showFiltersToggle={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder Configuration Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSaveTemplate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                Query Architect & Schema Designer
              </h3>
              <Button type="submit" size="sm" className="font-bold gap-1.5 text-xs">
                <Save className="w-3.5 h-3.5" /> Save Template
              </Button>
            </div>

            {/* Title & Desc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold">Template Title</Label>
                <Input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Q3 High Margin Sales Cohort"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold">Target Data Domain</Label>
                <Select
                  value={selectedModule}
                  onChange={(e) => {
                    const mod = e.target.value as keyof typeof AVAILABLE_FIELDS;
                    setSelectedModule(mod);
                    setSelectedFields(AVAILABLE_FIELDS[mod].slice(0, 4));
                  }}
                  className="mt-1 text-xs"
                >
                  <option value="SALES">Sales & Revenue</option>
                  <option value="ORDERS">Orders & Fulfillment</option>
                  <option value="CUSTOMERS">Customer CRM</option>
                  <option value="INVENTORY">Inventory & Valuation</option>
                  <option value="FINANCE">Finance & Invoices</option>
                </Select>
              </div>
            </div>

            {/* Field Selector Chips */}
            <div>
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Select Output Attributes ({selectedFields.length} selected)
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableForModule.map((field) => {
                  const isSelected = selectedFields.includes(field);
                  return (
                    <button
                      key={field}
                      type="button"
                      onClick={() => handleToggleField(field)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{field}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grouping, Sorting, Aggregations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div>
                <Label className="text-xs font-bold">Group By</Label>
                <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="mt-1 text-xs">
                  <option value="category">Category</option>
                  <option value="customerGroup">Customer Group</option>
                  <option value="warehouse">Warehouse Location</option>
                  <option value="paymentGateway">Payment Gateway</option>
                  <option value="none">No Grouping (Flat)</option>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold">Aggregation Math</Label>
                <Select value={aggregation} onChange={(e) => setAggregation(e.target.value as any)} className="mt-1 text-xs">
                  <option value="SUM">SUM (Total Value)</option>
                  <option value="AVG">AVG (Average Value)</option>
                  <option value="COUNT">COUNT (Record Volume)</option>
                  <option value="MAX">MAX (Highest)</option>
                  <option value="MIN">MIN (Lowest)</option>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold">Sort Order</Label>
                <Select value={`${sortBy}:${sortOrder}`} onChange={(e) => {
                  const [sb, so] = e.target.value.split(':');
                  setSortBy(sb);
                  setSortOrder(so as any);
                }} className="mt-1 text-xs">
                  <option value="grossRevenue:desc">Revenue (High → Low)</option>
                  <option value="grossRevenue:asc">Revenue (Low → High)</option>
                  <option value="orderDate:desc">Newest First</option>
                  <option value="orderDate:asc">Oldest First</option>
                </Select>
              </div>
            </div>
          </form>

          {/* Live Output Preview */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                Live Dataset Preview Matrix
              </h3>
              <Button variant="outline" size="sm" onClick={() => openExportModal('Custom Builder Preview')} className="text-xs gap-1.5">
                Export Preview
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-500 font-bold uppercase">
                    {selectedFields.map((f) => (
                      <th key={f} className="p-3 font-mono">{f}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 font-mono text-slate-700 dark:text-zinc-300">
                    {selectedFields.map((f) => (
                      <td key={f} className="p-3">
                        {f.includes('Revenue') || f.includes('Price') || f.includes('Valuation')
                          ? '$284,500'
                          : f.includes('Name') || f.includes('customer')
                          ? 'Boeing Global'
                          : f.includes('Date')
                          ? '2026-07-22'
                          : 'Sample Output Data'}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 font-mono text-slate-700 dark:text-zinc-300">
                    {selectedFields.map((f) => (
                      <td key={f} className="p-3">
                        {f.includes('Revenue') || f.includes('Price') || f.includes('Valuation')
                          ? '$192,100'
                          : f.includes('Name') || f.includes('customer')
                          ? 'Airbus Defense'
                          : f.includes('Date')
                          ? '2026-07-21'
                          : 'Sample Output Data'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Saved Templates Library (1 col) */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Saved Custom Templates ({customTemplates.length})
          </h3>

          <div className="space-y-3">
            {customTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{tmpl.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{tmpl.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {tmpl.module}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-zinc-800 text-[11px] text-slate-500">
                  <span>Fields: {tmpl.selectedFields.length}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicateTemplate(tmpl.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                      title="Duplicate Template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(tmpl.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Delete Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportExportModal />
    </div>
  );
}
