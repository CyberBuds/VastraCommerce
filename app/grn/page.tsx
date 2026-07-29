'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, GRNItem, GRN } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button } from '@/components/enterprise/BaseInputs';
import { 
  Plus, 
  CheckCircle, 
  Layers, 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers2
} from 'lucide-react';
import { toast } from 'sonner';

function GRNContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { grns, purchaseOrders, addGRN } = useInventoryStore();

  const [isReceivingFlow, setIsReceivingFlow] = React.useState(false);
  const [selectedPoId, setSelectedPoId] = React.useState('');
  
  // Received list of items state
  const [grnItems, setGrnItems] = React.useState<{
    sku: string;
    productName: string;
    orderedQty: number;
    acceptedQty: number;
    rejectedQty: number;
    rejectReason: string;
    batchNumber: string;
    serialsStr: string;
  }[]>([]);

  const [checkedBy, setCheckedBy] = React.useState('Ramesh Kumar');

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Goods Received Notes' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Approved POs that are NOT fully received yet
  const pendingArrivalPOs = purchaseOrders.filter(po => 
    (po.status === 'APPROVED' || po.status === 'PARTIALLY_RECEIVED')
  );

  React.useEffect(() => {
    if (pendingArrivalPOs.length > 0 && !selectedPoId) {
      const firstPoId = pendingArrivalPOs[0].id;
      Promise.resolve().then(() => {
        setSelectedPoId(prev => prev || firstPoId);
      });
    }
  }, [pendingArrivalPOs, selectedPoId]);

  // Load items from selected PO
  React.useEffect(() => {
    if (selectedPoId) {
      const match = purchaseOrders.find(po => po.id === selectedPoId);
      if (match) {
        const nextItems = match.items.map(it => ({
          sku: it.sku,
          productName: it.productName,
          orderedQty: it.quantity - it.receivedQty,
          acceptedQty: it.quantity - it.receivedQty,
          rejectedQty: 0,
          rejectReason: '',
          batchNumber: `BAT-LOG-${Date.now().toString().slice(-4)}`,
          serialsStr: '',
        }));
        Promise.resolve().then(() => {
          setGrnItems(nextItems);
        });
      }
    }
  }, [selectedPoId, purchaseOrders]);

  const handleQtyChange = (index: number, field: 'acceptedQty' | 'rejectedQty', value: number) => {
    setGrnItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      
      // Auto-balance if needed
      if (field === 'acceptedQty') {
        const remaining = copy[index].orderedQty - value;
        copy[index].rejectedQty = Math.max(0, remaining);
      }
      return copy;
    });
  };

  const handleTextChange = (index: number, field: 'rejectReason' | 'batchNumber' | 'serialsStr', value: string) => {
    setGrnItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleGRNSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoId || grnItems.length === 0) {
      toast.error('Incomplete GRN Worksheet.');
      return;
    }

    const matchingPO = purchaseOrders.find(p => p.id === selectedPoId);
    if (!matchingPO) {
      toast.error('Purchase Order mismatched.');
      return;
    }

    const formattedItems: GRNItem[] = grnItems.map(gi => ({
      sku: gi.sku,
      productName: gi.productName,
      orderedQty: gi.orderedQty,
      acceptedQty: gi.acceptedQty,
      rejectedQty: gi.rejectedQty,
      rejectReason: gi.rejectReason || undefined,
      batchNumber: gi.batchNumber || undefined,
      serialNumbers: gi.serialsStr ? gi.serialsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    }));

    addGRN({
      grnNumber: `GRN-2026-${String(grns.length + 1).padStart(4, '0')}`,
      poId: selectedPoId,
      poNumber: matchingPO.poNumber,
      supplierName: matchingPO.supplierName,
      warehouseName: matchingPO.warehouseName,
      items: formattedItems,
      checkedBy: checkedBy || 'QA Officer',
    });

    toast.success('Goods Received Note committed. Stock credited and PO receipt levels updated.');
    setIsReceivingFlow(false);
    setSelectedPoId('');
  };

  return (
    <div className="space-y-6" id="grn-ledger-root">
      
      {/* Header panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Goods Received Notes (GRN)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Verify and audit physical deliveries against approved purchase contracts. Record batch numbers, log quality checks, and credit stock.
          </p>
        </div>
        <div>
          {!isReceivingFlow ? (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                if (pendingArrivalPOs.length === 0) {
                  toast.error('No approved purchase orders are currently pending arrival.');
                  return;
                }
                setIsReceivingFlow(true);
              }}
              className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Inward Cargo Receipt
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsReceivingFlow(false)}
            >
              Close Receipt Flow
            </Button>
          )}
        </div>
      </div>

      {!isReceivingFlow ? (
        /* GRN list ledger */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450">
            Historic GRN Waybill Archive
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono">
                  <th className="py-2.5 px-3">GRN Waybill</th>
                  <th className="py-2.5 px-3">Associated PO</th>
                  <th className="py-2.5 px-3">Manufacturer Supplier</th>
                  <th className="py-2.5 px-3">Destination Site</th>
                  <th className="py-2.5 px-3 text-center">Receipt Date</th>
                  <th className="py-2.5 px-3 text-right">Items Verified</th>
                  <th className="py-2.5 px-3">QA Check By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/60">
                {grns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-mono">
                      No Goods Received Notes filed yet. Click Inward Cargo Receipt to check in arrived trucks.
                    </td>
                  </tr>
                ) : (
                  grns.map((g) => {
                    const totalAccepted = g.items.reduce((sum, item) => sum + item.acceptedQty, 0);
                    return (
                      <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20">
                        <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-900 dark:text-zinc-150">
                          {g.grnNumber}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-500">
                          {g.poNumber}
                        </td>
                        <td className="py-3 px-3 font-extrabold text-slate-800 dark:text-zinc-200">
                          {g.supplierName}
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-600 dark:text-zinc-350">
                          {g.warehouseName}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-[10px] text-slate-400">
                          {new Date(g.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                          {totalAccepted} units ({g.items.length} SKUs)
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-zinc-300">
                          {g.checkedBy}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Dynamic Inward cargo checker GRN wizard sheet */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-50 flex items-center">
                <FileCheck2 className="w-5 h-5 mr-1.5 text-slate-500" />
                GRN QA Receipt Worksheet
              </h3>
              <p className="text-xs text-slate-400 font-mono">Verify and check inward supplier parcels.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Select Approved PO:</label>
              <select 
                value={selectedPoId}
                onChange={(e) => setSelectedPoId(e.target.value)}
                className="text-xs font-bold p-2 border border-slate-200 dark:border-zinc-700 rounded-md bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                {pendingArrivalPOs.map(po => (
                  <option key={po.id} value={po.id}>{po.poNumber} - {po.supplierName.split(' ')[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleGRNSubmit} className="space-y-6">
            
            {/* QA Inspector Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">QA Inspector / Checked By</label>
                <input 
                  value={checkedBy}
                  onChange={(e) => setCheckedBy(e.target.value)}
                  className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Line items verification table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono block">Line Items Verification</span>
              
              <div className="space-y-4">
                {grnItems.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-zinc-850/60 border border-slate-150 dark:border-zinc-800 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{item.productName}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-500">
                        Remaining PO Qty: {item.orderedQty} units
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Accepted Qty</label>
                        <input 
                          type="number"
                          value={item.acceptedQty}
                          onChange={(e) => handleQtyChange(idx, 'acceptedQty', parseInt(e.target.value) || 0)}
                          className="w-full text-xs font-bold font-mono p-1.5 border border-slate-250 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Rejected Qty (Forklift damage)</label>
                        <input 
                          type="number"
                          value={item.rejectedQty}
                          onChange={(e) => handleQtyChange(idx, 'rejectedQty', parseInt(e.target.value) || 0)}
                          className="w-full text-xs font-bold font-mono p-1.5 border border-slate-250 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Rejection Reason Remarks</label>
                        <input 
                          placeholder="e.g. Broken structural packaging, leakage detected..."
                          value={item.rejectReason}
                          onChange={(e) => handleTextChange(idx, 'rejectReason', e.target.value)}
                          className="w-full text-xs font-medium p-1.5 border border-slate-250 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Assign Batch Number Stamp</label>
                        <input 
                          value={item.batchNumber}
                          onChange={(e) => handleTextChange(idx, 'batchNumber', e.target.value)}
                          className="w-full text-xs font-bold font-mono p-1.5 border border-slate-250 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Assign Serial Numbers (Comma separated)</label>
                        <input 
                          placeholder="e.g. SN-A12, SN-A13, SN-A14..."
                          value={item.serialsStr}
                          onChange={(e) => handleTextChange(idx, 'serialsStr', e.target.value)}
                          className="w-full text-xs font-bold font-mono p-1.5 border border-slate-250 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">* Submitting credits accepted quantities immediately to stock ledger.</span>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsReceivingFlow(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm Cargo Check-In
                </Button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

export default function GRNPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <GRNContent />
      </AdminLayout>
    </AppProviders>
  );
}
