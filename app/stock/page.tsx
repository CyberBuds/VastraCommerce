'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, StockItem } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Warehouse, 
  AlertCircle, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

function StockContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { stock, warehouses, adjustStockLevel } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');

  // Adjustment Modal state
  const [adjustingItem, setAdjustingItem] = React.useState<StockItem | null>(null);
  const [adjType, setAdjType] = React.useState<'STOCK_IN' | 'STOCK_OUT' | 'DAMAGE' | 'RESERVE'>('STOCK_IN');
  const [adjQty, setAdjQty] = React.useState<number>(10);
  const [adjNotes, setAdjNotes] = React.useState<string>('');

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Stock Control' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Compute stats
  const totalItemsCount = stock.length;
  const lowStockCount = stock.filter(s => s.available > 0 && s.available < 20).length;
  const outOfStockCount = stock.filter(s => s.available === 0).length;

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    if (adjQty <= 0) {
      toast.error('Adjustment quantity must be greater than zero.');
      return;
    }

    if (adjType === 'STOCK_OUT' && adjustingItem.available < adjQty) {
      toast.error(`Insufficient stock! Cannot issue ${adjQty} units. Only ${adjustingItem.available} units available.`);
      return;
    }

    adjustStockLevel(
      adjustingItem.warehouseId,
      adjustingItem.sku,
      adjType,
      adjQty,
      adjNotes || `Manual stock override adjustment: ${adjType}`,
      `MAN-${Date.now().toString().slice(-4)}`
    );

    toast.success(`Successfully recorded "${adjType}" adjustment for ${adjustingItem.productName}.`);
    setAdjustingItem(null);
    setAdjNotes('');
    setAdjQty(10);
  };

  // Filter Stock Levels
  const filteredStock = stock.filter(s => {
    const matchesSearch = s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWh = selectedWarehouseId === 'ALL' || s.warehouseId === selectedWarehouseId;
    
    let matchesStatus = true;
    if (selectedStatus === 'OUT_OF_STOCK') matchesStatus = s.available === 0;
    else if (selectedStatus === 'LOW_STOCK') matchesStatus = s.available > 0 && s.available < 20;
    else if (selectedStatus === 'IN_STOCK') matchesStatus = s.available >= 20;

    return matchesSearch && matchesWh && matchesStatus;
  });

  return (
    <div className="space-y-6" id="stock-control-root">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Stock Control Ledger
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor SKU inventory level vectors, dispatch reserves, log damaged batches and perform manual audit overrides.
          </p>
        </div>
      </div>

      {/* Stock Health Quick Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/40 dark:border-emerald-900/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-mono block uppercase">Healthy SKUs</span>
            <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
              {totalItemsCount - lowStockCount - outOfStockCount} SKUs
            </span>
          </div>
          <Sparkles className="w-8 h-8 text-emerald-400/80" />
        </div>

        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/40 dark:border-amber-900/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 font-mono block uppercase">Low Stock Safety Alarm</span>
            <span className="text-xl font-extrabold text-amber-800 dark:text-amber-300 font-mono">
              {lowStockCount} SKUs
            </span>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-400/80" />
        </div>

        <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/40 dark:border-rose-900/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 font-mono block uppercase">Critically Out of Stock</span>
            <span className="text-xl font-extrabold text-rose-800 dark:text-rose-300 font-mono">
              {outOfStockCount} SKUs
            </span>
          </div>
          <TrendingDown className="w-8 h-8 text-rose-400/80" />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search stock by SKU, product name, or barcode..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg outline-hidden focus:ring-1 focus:ring-slate-500 text-slate-700 dark:text-zinc-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center">
              <Warehouse className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Warehouse:
            </span>
            <select 
              value={selectedWarehouseId} 
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              className="p-1.5 text-xs font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
            >
              <option value="ALL">All Multi-Sites</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Safety:
            </span>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 text-xs font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
            >
              <option value="ALL">All Levels</option>
              <option value="IN_STOCK">In Stock (Healthy)</option>
              <option value="LOW_STOCK">Low Stock Alert</option>
              <option value="OUT_OF_STOCK">Out Of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-density interactive data table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono">
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Damaged</th>
                <th className="py-3 px-4 text-center">In Flow</th>
                <th className="py-3 px-4">Safety Badge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/85 text-xs">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-450 font-mono">
                    No active inventory level vectors found matching search query.
                  </td>
                </tr>
              ) : (
                filteredStock.map((item) => {
                  let badgeVariant: 'success' | 'warning' | 'error' = 'success';
                  let statusText = 'IN STOCK';
                  if (item.available === 0) {
                    badgeVariant = 'error';
                    statusText = 'OUT OF STOCK';
                  } else if (item.available < 20) {
                    badgeVariant = 'warning';
                    statusText = 'LOW STOCK';
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-850/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono text-[11px] text-slate-900 dark:text-zinc-50">
                        {item.sku}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-800 dark:text-zinc-200">{item.productName}</div>
                        <div className="flex gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                          <span>Barcode: {item.barcode}</span>
                          <span>•</span>
                          <span>Category: {item.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-600 dark:text-zinc-300">
                          {item.warehouseName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-sm text-slate-800 dark:text-zinc-100">
                        {item.available.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-500">
                        {item.reserved.toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-4 text-center font-bold font-mono ${item.damaged > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {item.damaged.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-blue-500">
                        {item.incoming.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={badgeVariant}>{statusText}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setAdjustingItem(item)}
                            className="py-1 px-2 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md border border-slate-250 dark:border-zinc-700 transition-all"
                          >
                            Adjust
                          </button>
                          <Link href={`/stock/details/${item.id}`}>
                            <button className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-zinc-200 rounded-md transition-all flex items-center">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Adjustment Modal Dialog */}
      {adjustingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-900 dark:text-zinc-50 flex items-center">
                <RotateCcw className="w-4 h-4 mr-1.5 text-slate-500 animate-spin-slow" />
                Ledger Manual Adjustment
              </h3>
              <button 
                onClick={() => setAdjustingItem(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-zinc-850 p-3 rounded-lg border border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Product SKU:</span> <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{adjustingItem.sku}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Name:</span> <span className="font-extrabold text-slate-850 dark:text-zinc-200 text-right">{adjustingItem.productName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Depot Location:</span> <span className="font-semibold text-slate-700 dark:text-zinc-300">{adjustingItem.warehouseName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">In-Stock units:</span> <span className="font-mono font-extrabold text-slate-900 dark:text-zinc-50">{adjustingItem.available} units</span></div>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Adjustment Type</label>
                  <select 
                    value={adjType}
                    onChange={(e: any) => setAdjType(e.target.value)}
                    className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                  >
                    <option value="STOCK_IN">Stock In (Add)</option>
                    <option value="STOCK_OUT">Stock Out (Deduct)</option>
                    <option value="DAMAGE">Log Damage (Moves to Damage)</option>
                    <option value="RESERVE">Add to Reserve</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Delta Quantity</label>
                  <input 
                    type="number"
                    value={adjQty}
                    onChange={(e) => setAdjQty(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Override Reason / Audit Notes</label>
                <textarea 
                  placeholder="e.g. Stock replenishment, physical count audit delta corrected, forklift leakage reported..."
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden min-h-[60px]"
                  required
                />
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAdjustingItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Commit Override
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

export default function StockControlPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <StockContent />
      </AdminLayout>
    </AppProviders>
  );
}
