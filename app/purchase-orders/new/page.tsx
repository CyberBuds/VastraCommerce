'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button } from '@/components/enterprise/BaseInputs';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Trash2, FileText, ShoppingBag, Save } from 'lucide-react';
import { toast } from 'sonner';

function NewPurchaseOrderContent() {
  const router = useRouter();
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { suppliers, warehouses, stock, addPurchaseOrder } = useInventoryStore();

  const [selectedSupplierId, setSelectedSupplierId] = React.useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = React.useState('2026-08-15');
  const [notes, setNotes] = React.useState('');

  // Added Items
  const [poItems, setPoItems] = React.useState<{ sku: string; productName: string; quantity: number; price: number }[]>([]);
  
  // Single Item Draft State
  const [draftSku, setDraftSku] = React.useState('');
  const [draftQty, setDraftQty] = React.useState<number>(50);
  const [draftPrice, setDraftPrice] = React.useState<number>(15.0);

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Purchase Orders', href: '/purchase-orders' },
      { label: 'Draft PO Waybill' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Seed default selections
  React.useEffect(() => {
    if (suppliers.length > 0 && !selectedSupplierId) {
      const sId = suppliers[0].id;
      Promise.resolve().then(() => setSelectedSupplierId(prev => prev || sId));
    }
    if (warehouses.length > 0 && !selectedWarehouseId) {
      const wId = warehouses[0].id;
      Promise.resolve().then(() => setSelectedWarehouseId(prev => prev || wId));
    }
  }, [suppliers, warehouses, selectedSupplierId, selectedWarehouseId]);

  // Unique list of products from stock to choose from
  const catalogProducts = Array.from(new Set(stock.map(s => JSON.stringify({ sku: s.sku, name: s.productName })))).map(s => JSON.parse(s));

  React.useEffect(() => {
    if (catalogProducts.length > 0 && !draftSku) {
      const firstSku = catalogProducts[0].sku;
      Promise.resolve().then(() => setDraftSku(prev => prev || firstSku));
    }
  }, [catalogProducts, draftSku]);

  // Fill in default price helper
  React.useEffect(() => {
    if (draftSku) {
      const getEstimatedPrice = (sku: string) => {
        if (sku.endsWith('10000')) return 950.0;
        if (sku.endsWith('10001')) return 12.5;
        if (sku.endsWith('10002')) return 180.0;
        if (sku.endsWith('10003')) return 450.0;
        if (sku.endsWith('10004')) return 1200.0;
        return 100.0;
      };
      const estPrice = getEstimatedPrice(draftSku);
      Promise.resolve().then(() => setDraftPrice(prev => prev !== estPrice ? estPrice : prev));
    }
  }, [draftSku]);

  const handleAddItem = () => {
    if (!draftSku) {
      toast.error('Select a valid SKU from Catalog.');
      return;
    }

    if (draftQty <= 0) {
      toast.error('Quantity must be greater than zero.');
      return;
    }

    // Check if SKU already added
    const exists = poItems.some(item => item.sku === draftSku);
    if (exists) {
      toast.error('Item SKU already added to this PO. Modify quantity or delete first.');
      return;
    }

    const matchedProduct = stock.find(s => s.sku === draftSku);
    const productName = matchedProduct ? matchedProduct.productName : 'Unclassified Product';

    setPoItems(prev => [
      ...prev,
      { sku: draftSku, productName, quantity: draftQty, price: draftPrice }
    ]);

    toast.success(`Added ${productName} to line items.`);
  };

  const handleRemoveItem = (index: number) => {
    setPoItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !selectedWarehouseId || poItems.length === 0) {
      toast.error('Draft incomplete! Must select Supplier, Warehouse, and at least 1 Item.');
      return;
    }

    const supplierObj = suppliers.find(s => s.id === selectedSupplierId);
    const warehouseObj = warehouses.find(w => w.id === selectedWarehouseId);

    if (!supplierObj || !warehouseObj) {
      toast.error('Routing nodes mismatch.');
      return;
    }

    addPurchaseOrder({
      supplierId: selectedSupplierId,
      supplierName: supplierObj.company,
      warehouseId: selectedWarehouseId,
      warehouseName: warehouseObj.name,
      expectedDeliveryDate,
      status: 'PENDING_APPROVAL', // Auto-routes to approvals workflow
      items: poItems.map(it => ({ ...it, receivedQty: 0 })),
      attachments: [],
      notes: notes || 'Procurement Order Dispatched.',
    });

    toast.success('Purchase Order Draft submitted successfully for approvals.');
    router.push('/purchase-orders');
  };

  const totalContractCost = poItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="new-purchase-order-root">
      
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="p-2 w-9 h-9"
          onClick={() => router.push('/purchase-orders')}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center">
            <FileText className="w-5 h-5 mr-2 text-slate-500" />
            File Purchase Order Draft
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Register a vendor procurement waybill to dispatch manufacturing lots to our sites.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Routing Coordinates */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            PO Coordinates
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Procure Supplier (Vendor)</label>
              <select 
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full text-xs font-bold p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.company}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Consignee Warehouse (Depot)</label>
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
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Expected Cargo Arrival</label>
              <input 
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Contracts / Cargo Notes</label>
              <textarea 
                placeholder="Shipping agreements, custom port clearances..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* PO Line Items Constructor */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450">
            PO Line Items Configuration
          </h3>

          {/* Inline constructor input */}
          <div className="p-4 rounded-lg bg-slate-50/50 dark:bg-zinc-850/40 border border-slate-100 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Product Item SKU</label>
              <select 
                value={draftSku}
                onChange={(e) => setDraftSku(e.target.value)}
                className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                {catalogProducts.map(p => (
                  <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Order Qty (units)</label>
              <input 
                type="number"
                value={draftQty}
                onChange={(e) => setDraftQty(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Unit Cost Contract</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={draftPrice}
                  onChange={(e) => setDraftPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                />
                <Button 
                  type="button" 
                  variant="primary" 
                  size="sm" 
                  onClick={handleAddItem}
                  className="px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Current line items table */}
          <div className="border border-slate-100 dark:border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-850 font-mono text-[9px] font-bold uppercase border-b border-slate-100 dark:border-zinc-800 text-slate-400">
                  <th className="py-2.5 px-3">Item details</th>
                  <th className="py-2.5 px-3 text-right">Order Volume</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Cost Mapped</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-800/50">
                {poItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-mono italic">
                      No line items compiled yet. Add line items from the panel above.
                    </td>
                  </tr>
                ) : (
                  poItems.map((it, idx) => (
                    <tr key={idx} className="font-mono">
                      <td className="py-3 px-3">
                        <span className="font-sans font-bold text-slate-800 dark:text-zinc-200 block">{it.productName}</span>
                        <span className="text-[10px] text-slate-400">{it.sku}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-700 dark:text-zinc-300">
                        {it.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500">
                        ₹{it.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-zinc-100">
                        ₹{(it.quantity * it.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sum details & submits */}
          <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Contract Valuation:</span>
              <p className="text-lg font-extrabold font-mono text-slate-900 dark:text-zinc-50">
                ₹{totalContractCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => router.push('/purchase-orders')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm"
                disabled={poItems.length === 0}
                className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Submit PO Waybill
              </Button>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}

export default function NewPurchaseOrderPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <NewPurchaseOrderContent />
      </AdminLayout>
    </AppProviders>
  );
}
