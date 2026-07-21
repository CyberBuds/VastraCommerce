'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, StockTransfer } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { 
  Plus, 
  ArrowRightLeft, 
  Truck, 
  Check, 
  X, 
  MapPin, 
  History,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

function StockTransfersContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { 
    stockTransfers, 
    warehouses, 
    stock, 
    addStockTransfer, 
    updateTransferStatus 
  } = useInventoryStore();

  const [fromWarehouseId, setFromWarehouseId] = React.useState('');
  const [toWarehouseId, setToWarehouseId] = React.useState('');
  const [selectedSku, setSelectedSku] = React.useState('');
  const [qty, setQty] = React.useState<number>(10);
  const [trackingCode, setTrackingCode] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Stock Transfers' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Set default warehouses
  React.useEffect(() => {
    if (warehouses.length > 1) {
      const w0 = warehouses[0].id;
      const w1 = warehouses[1].id;
      Promise.resolve().then(() => {
        setFromWarehouseId(prev => prev || w0);
        setToWarehouseId(prev => prev || w1);
      });
    } else if (warehouses.length > 0) {
      const w0 = warehouses[0].id;
      Promise.resolve().then(() => {
        setFromWarehouseId(prev => prev || w0);
        setToWarehouseId(prev => prev || w0);
      });
    }
  }, [warehouses]);

  // Available SKUs in origin warehouse
  const originStock = stock.filter(s => s.warehouseId === fromWarehouseId && s.available > 0);

  // Set default SKU
  React.useEffect(() => {
    const nextSku = originStock.length > 0 ? originStock[0].sku : '';
    Promise.resolve().then(() => {
      setSelectedSku(prev => prev !== nextSku ? nextSku : prev);
    });
  }, [fromWarehouseId, originStock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromWarehouseId || !toWarehouseId || !selectedSku || qty <= 0) {
      toast.error('Please input complete transfer routing coordinates.');
      return;
    }

    if (fromWarehouseId === toWarehouseId) {
      toast.error('Source and Destination Warehouses cannot be identical.');
      return;
    }

    const originItem = stock.find(s => s.sku === selectedSku && s.warehouseId === fromWarehouseId);
    const fromWh = warehouses.find(w => w.id === fromWarehouseId);
    const toWh = warehouses.find(w => w.id === toWarehouseId);

    if (!originItem || !fromWh || !toWh) {
      toast.error('Failed to map routing codes.');
      return;
    }

    if (originItem.available < qty) {
      toast.error(`Insufficient stock! ${originItem.available} units available in ${fromWh.name}.`);
      return;
    }

    addStockTransfer({
      fromWarehouseId,
      fromWarehouseName: fromWh.name,
      toWarehouseId,
      toWarehouseName: toWh.name,
      status: 'PENDING',
      trackingCode: trackingCode || `TRK-AERO-${Date.now().toString().slice(-4)}`,
      items: [
        { sku: selectedSku, productName: originItem.productName, quantity: qty }
      ],
      notes: notes || `Inter-depot stock balancing: ${originItem.productName}`,
    });

    toast.success('Inter-depot Stock Transfer registered.');
    setNotes('');
    setQty(10);
  };

  const handleStatusChange = (id: string, name: string, status: StockTransfer['status']) => {
    updateTransferStatus(id, status);
    toast.success(`Transfer ${name} moved to state: ${status}.`);
  };

  return (
    <div className="space-y-6" id="stock-transfers-root">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Inter-Warehouse Stock Transfers
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Route product inventory volumes between registered depot sites. Balance supply lines and audit trans-shipment codes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form panel */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <Plus className="w-4 h-4 mr-1.5" />
            Initiate Transfer Waybill
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">From (Origin)</label>
                <select 
                  value={fromWarehouseId}
                  onChange={(e) => setFromWarehouseId(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">To (Destination)</label>
                <select 
                  value={toWarehouseId}
                  onChange={(e) => setToWarehouseId(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Item SKU in Origin Depot</label>
              <select 
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full text-xs font-bold font-mono p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                disabled={originStock.length === 0}
              >
                {originStock.length === 0 ? (
                  <option>No available stock in Origin</option>
                ) : (
                  originStock.map(s => (
                    <option key={s.id} value={s.sku}>{s.sku} ({s.available} available)</option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Transfer Quantity</label>
                <input 
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Courier Tracking</label>
                <input 
                  type="text"
                  placeholder="e.g. DTDC-X1"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Waybill Notes</label>
              <textarea 
                placeholder="Routing instructions, custom gate pass references..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden min-h-[60px]"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-2.5 text-xs font-bold"
              disabled={originStock.length === 0}
            >
              Dispatch Transfer
            </Button>
          </form>
        </div>

        {/* Transfers list */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <History className="w-4 h-4 mr-1.5" />
            Trans-Shipment Ledger Waybills
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono">
                  <th className="py-2.5 px-3">Transfer Waybill</th>
                  <th className="py-2.5 px-3">Route & Items</th>
                  <th className="py-2.5 px-3">Carrier Info</th>
                  <th className="py-2.5 px-3">Status Badge</th>
                  <th className="py-2.5 px-3 text-right">Waybill Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/60">
                {stockTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
                      No active trans-shipment logs recorded. Create waybills to route inventory.
                    </td>
                  </tr>
                ) : (
                  stockTransfers.map((tr) => (
                    <tr key={tr.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20">
                      <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-400">
                        {tr.transferNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                          <span>{tr.fromWarehouseName.split(' ')[0]}</span>
                          <span className="text-slate-400">➔</span>
                          <span>{tr.toWarehouseName.split(' ')[0]}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          {tr.items.map((item, i) => (
                            <span key={i}>{item.productName} ({item.quantity} units)</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-600 dark:text-zinc-300">
                        <span className="flex items-center">
                          <Truck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {tr.trackingCode}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={
                          tr.status === 'COMPLETED' ? 'success' :
                          tr.status === 'REJECTED' ? 'error' :
                          tr.status === 'IN_TRANSIT' ? 'info' : 'warning'
                        }>
                          {tr.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {tr.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleStatusChange(tr.id, tr.transferNumber, 'IN_TRANSIT')}
                              className="px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900 border border-blue-200/50 rounded-md transition-all"
                            >
                              Dispatch
                            </button>
                            <button 
                              onClick={() => handleStatusChange(tr.id, tr.transferNumber, 'REJECTED')}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-md"
                              title="Cancel waybill"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        {tr.status === 'IN_TRANSIT' && (
                          <button 
                            onClick={() => handleStatusChange(tr.id, tr.transferNumber, 'COMPLETED')}
                            className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900 border border-emerald-200/50 rounded-md transition-all"
                          >
                            Mark Received
                          </button>
                        )}
                        {tr.status === 'COMPLETED' && (
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                            DELIVERED
                          </span>
                        )}
                        {tr.status === 'REJECTED' && (
                          <span className="text-[10px] font-mono text-rose-500 font-bold uppercase">
                            CANCELLED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function StockTransfersPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <StockTransfersContent />
      </AdminLayout>
    </AppProviders>
  );
}
