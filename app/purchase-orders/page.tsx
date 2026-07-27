'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, PurchaseOrder } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  FileText, 
  Check, 
  X, 
  Clock, 
  Building2, 
  AlertCircle,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { toast } from 'sonner';

function PurchaseOrdersContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { purchaseOrders, updatePurchaseOrderStatus } = useInventoryStore();

  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [selectedPO, setSelectedPO] = React.useState<PurchaseOrder | null>(null);

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Purchase Orders' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  const handleApprove = (id: string, poNum: string) => {
    updatePurchaseOrderStatus(id, 'APPROVED', 'L4 logistics clearance granted', 'Yash Gupta (Super Admin)');
    toast.success(`Purchase Order ${poNum} approved and released to Supplier.`);
    setSelectedPO(null);
  };

  const handleCancel = (id: string, poNum: string) => {
    if (confirm(`Are you sure you want to cancel Purchase Order ${poNum}?`)) {
      updatePurchaseOrderStatus(id, 'CANCELLED', 'Cancelled by administrator manually.', 'Yash Gupta (Super Admin)');
      toast.warning(`Purchase Order ${poNum} cancelled.`);
      setSelectedPO(null);
    }
  };

  const filteredPOs = purchaseOrders.filter(po => {
    if (statusFilter === 'ALL') return true;
    return po.status === statusFilter;
  });

  return (
    <div className="space-y-6" id="purchase-orders-root">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Purchase Orders (PO)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Procure inventory assets from external manufacturers. Track procurement line items, contract values, and receipt statuses.
          </p>
        </div>
        <div>
          <Link href="/purchase-orders/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Draft Purchase Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Status State:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
          >
            <option value="ALL">All PO States</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Released (Approved)</option>
            <option value="PARTIALLY_RECEIVED">Partially Received</option>
            <option value="RECEIVED">Fully Received</option>
            <option value="CANCELLED">Decline (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* PO Grid list */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono">
                <th className="py-3 px-4">PO Code</th>
                <th className="py-3 px-4">Manufacturer (Supplier)</th>
                <th className="py-3 px-4">Destination Depot</th>
                <th className="py-3 px-4 text-center">Procured Items</th>
                <th className="py-3 px-4 text-right">Contract Value</th>
                <th className="py-3 px-4 text-center">Exp Delivery</th>
                <th className="py-3 px-4">Status State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/85">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-450 font-mono">
                    No active purchase order waybills registered for status: {statusFilter}.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => {
                  const totalCost = po.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const totalItemsCount = po.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <tr key={po.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-850/20">
                      <td className="py-3.5 px-4 font-bold font-mono text-[11px] text-slate-900 dark:text-zinc-50">
                        {po.poNumber}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-zinc-200">
                        {po.supplierName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-zinc-350">
                        {po.warehouseName}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono">
                        {totalItemsCount} units ({po.items.length} SKUs)
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold font-mono text-slate-800 dark:text-zinc-100">
                        ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">
                        {po.expectedDeliveryDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={
                          po.status === 'RECEIVED' ? 'success' :
                          po.status === 'APPROVED' ? 'info' :
                          po.status === 'CANCELLED' ? 'error' :
                          po.status === 'PARTIALLY_RECEIVED' ? 'purple' : 'warning'
                        }>
                          {po.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedPO(po)}
                            className="py-1 px-2.5 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md border border-slate-250 dark:border-zinc-700 transition-all"
                          >
                            Worksheet
                          </button>
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

      {/* PO Detail Worksheet & Approval Modal */}
      {selectedPO && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-zinc-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-900 dark:text-zinc-50 flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-slate-500" />
                PO Worksheet: {selectedPO.poNumber}
              </h3>
              <button 
                onClick={() => setSelectedPO(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Vendor and Depot */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">Supplier (Vendor)</span>
                <p className="font-extrabold text-slate-800 dark:text-zinc-100">{selectedPO.supplierName}</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">Consignee Warehouse</span>
                <p className="font-extrabold text-slate-800 dark:text-zinc-100">{selectedPO.warehouseName}</p>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-slate-100 dark:border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-850 font-mono text-[9px] font-bold uppercase border-b border-slate-100 dark:border-zinc-800 text-slate-400">
                    <th className="py-2 px-3">Item SKU Details</th>
                    <th className="py-2 px-3 text-right">Qty Mapped</th>
                    <th className="py-2 px-3 text-right">Price</th>
                    <th className="py-2 px-3 text-right">Cost Sum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-850/50">
                  {selectedPO.items.map((it, idx) => (
                    <tr key={idx} className="font-mono">
                      <td className="py-2 px-3">
                        <span className="font-sans font-bold text-slate-800 dark:text-zinc-200 block">{it.productName}</span>
                        <span className="text-[10px] text-slate-400">{it.sku}</span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-700 dark:text-zinc-300">
                        {it.quantity}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600 dark:text-zinc-400">
                        ₹{it.price.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-zinc-100">
                        ₹{(it.quantity * it.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Workflow status alerts */}
            <div className="bg-slate-50 dark:bg-zinc-850 p-3 rounded-lg text-xs space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Approval / Delivery Track</span>
              <div className="flex justify-between font-medium">
                <span>Expected Delivery Terminal:</span>
                <span className="font-mono">{selectedPO.expectedDeliveryDate}</span>
              </div>
              {selectedPO.approvalWorkflow.approver && (
                <div className="text-[11px] text-slate-500 font-medium">
                  Approved by: <span className="font-bold">{selectedPO.approvalWorkflow.approver}</span> ({new Date(selectedPO.approvalWorkflow.timestamp!).toLocaleDateString()})
                  <p className="italic text-slate-400 mt-0.5">Remarks: &quot;{selectedPO.approvalWorkflow.notes}&quot;</p>
                </div>
              )}
            </div>

            {/* PO Actions */}
            <div className="pt-2 border-t border-slate-150 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">PO Status: <span className="font-bold text-slate-500">{selectedPO.status}</span></span>
              
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => setSelectedPO(null)}>
                  Close
                </Button>
                {selectedPO.status === 'PENDING_APPROVAL' && (
                  <>
                    <Button variant="danger" size="sm" onClick={() => handleCancel(selectedPO.id, selectedPO.poNumber)}>
                      Cancel Draft
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleApprove(selectedPO.id, selectedPO.poNumber)}
                      className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Approve & Dispatch
                    </Button>
                  </>
                )}
                {selectedPO.status === 'APPROVED' && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(selectedPO.id, selectedPO.poNumber)}>
                    Revoke PO
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PurchaseOrdersPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <PurchaseOrdersContent />
      </AdminLayout>
    </AppProviders>
  );
}
