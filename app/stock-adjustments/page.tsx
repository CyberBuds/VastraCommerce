'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, StockAdjustment } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { 
  Plus, 
  RotateCcw, 
  Check, 
  X, 
  FileText, 
  AlertTriangle,
  History,
  TrendingDown,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { toast } from 'sonner';

function StockAdjustmentsContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { 
    stockAdjustments, 
    warehouses, 
    stock, 
    addStockAdjustment, 
    updateAdjustmentStatus 
  } = useInventoryStore();

  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState('');
  const [selectedSku, setSelectedSku] = React.useState('');
  const [qtyChange, setQtyChange] = React.useState<number>(5);
  const [reason, setReason] = React.useState('');

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Stock Adjustments' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Set default warehouse
  React.useEffect(() => {
    if (warehouses.length > 0 && !selectedWarehouseId) {
      const defaultWh = warehouses[0].id;
      Promise.resolve().then(() => {
        setSelectedWarehouseId(prev => prev || defaultWh);
      });
    }
  }, [warehouses, selectedWarehouseId]);

  // Available SKUs in selected warehouse
  const availableSkusInWh = stock.filter(s => s.warehouseId === selectedWarehouseId);

  // Set default SKU
  React.useEffect(() => {
    const nextSku = availableSkusInWh.length > 0 ? availableSkusInWh[0].sku : '';
    Promise.resolve().then(() => {
      setSelectedSku(prev => prev !== nextSku ? nextSku : prev);
    });
  }, [selectedWarehouseId, availableSkusInWh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouseId || !selectedSku || !reason.trim()) {
      toast.error('Please fill out all required adjustment parameters.');
      return;
    }

    const whObj = warehouses.find(w => w.id === selectedWarehouseId);
    const stockObj = stock.find(s => s.sku === selectedSku && s.warehouseId === selectedWarehouseId);

    if (!whObj || !stockObj) {
      toast.error('Unable to map product and warehouse nodes.');
      return;
    }

    if (qtyChange === 0) {
      toast.error('Adjustment delta cannot be zero.');
      return;
    }

    // Check if deducting more than available
    if (qtyChange < 0 && stockObj.available < Math.abs(qtyChange)) {
      toast.error(`Deduction bounds fault! Only ${stockObj.available} units available in ${whObj.name}.`);
      return;
    }

    addStockAdjustment({
      warehouseId: selectedWarehouseId,
      warehouseName: whObj.name,
      sku: selectedSku,
      productName: stockObj.productName,
      qtyChange,
      reason,
      status: 'PENDING',
    });

    toast.success('Stock adjustment proposal registered. Sent to logistics manager queue.');
    setReason('');
    setQtyChange(5);
  };

  const handleApprove = (id: string, name: string) => {
    updateAdjustmentStatus(id, 'APPROVED', 'Sarah Connor (L4 Manager)');
    toast.success(`Adjustment ${name} approved. Physical warehouse stock updated.`);
  };

  const handleReject = (id: string, name: string) => {
    updateAdjustmentStatus(id, 'REJECTED');
    toast.warning(`Adjustment proposal ${name} declined and filed.`);
  };

  return (
    <div className="space-y-6" id="stock-adjustments-root">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Inventory Adjustments
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Create and authorize stock value adjustments. Adjusting quantity changes physical shelf counts instantly on L4 authorization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Adjustment Submission Form */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <Plus className="w-4 h-4 mr-1.5" />
            File Adjustment Proposal
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Target Warehouse</label>
              <select 
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="w-full text-xs font-bold p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Select Item SKU</label>
              <select 
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full text-xs font-bold font-mono p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                disabled={availableSkusInWh.length === 0}
              >
                {availableSkusInWh.length === 0 ? (
                  <option>No items inside warehouse</option>
                ) : (
                  availableSkusInWh.map(s => (
                    <option key={s.id} value={s.sku}>{s.sku} - {s.productName}</option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500">Delta Quantity (Change)</label>
                <span className="text-[10px] text-slate-400 font-mono">Use negative to deduct</span>
              </div>
              <input 
                type="number"
                value={qtyChange}
                onChange={(e) => setQtyChange(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-bold font-mono p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Core Audit Reason</label>
              <textarea 
                placeholder="e.g. Forklift collision damaged 2 parts, physical count audit discrepancy resolved..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden min-h-[80px]"
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-2.5 text-xs font-bold"
              disabled={availableSkusInWh.length === 0}
            >
              Submit Proposal
            </Button>
          </form>
        </div>

        {/* Adjustments Queue Ledger */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <History className="w-4 h-4 mr-1.5" />
            Adjustments Audit Queue
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Location & SKU</th>
                  <th className="py-2.5 px-3 text-right">Delta</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Authorizations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/60">
                {stockAdjustments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                      No stock adjustments registered. Use left panel to file a proposal.
                    </td>
                  </tr>
                ) : (
                  stockAdjustments.map((adj) => {
                    const isPositive = adj.qtyChange > 0;
                    return (
                      <tr key={adj.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20">
                        <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-400">
                          {adj.adjustmentNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-800 dark:text-zinc-200">{adj.productName}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {adj.sku} • {adj.warehouseName.split(' ')[0]}
                          </div>
                        </td>
                        <td className={`py-3 px-3 text-right font-mono font-extrabold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? `+${adj.qtyChange}` : adj.qtyChange}
                        </td>
                        <td className="py-3 px-3 text-slate-500 italic max-w-[150px] truncate" title={adj.reason}>
                          {adj.reason}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={
                            adj.status === 'APPROVED' ? 'success' :
                            adj.status === 'REJECTED' ? 'error' : 'warning'
                          }>
                            {adj.status}
                          </Badge>
                          {adj.approvedBy && (
                            <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                              By: {adj.approvedBy.split(' ')[0]}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {adj.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleApprove(adj.id, adj.adjustmentNumber)}
                                className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-150 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900 rounded-md transition-all"
                                title="Authorize & Commit Stock"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(adj.id, adj.adjustmentNumber)}
                                className="p-1 bg-rose-50 text-rose-700 hover:bg-rose-150 border border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900 rounded-md transition-all"
                                title="Decline Proposal"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">
                              ARCHIVED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function StockAdjustmentsPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <StockAdjustmentsContent />
      </AdminLayout>
    </AppProviders>
  );
}
