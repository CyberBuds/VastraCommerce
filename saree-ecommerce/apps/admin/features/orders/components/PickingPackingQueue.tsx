'use client';

import * as React from 'react';
import { Order, OrderItem } from '@/types/order';
import { 
  useOrders, 
  useStartPicking, 
  useUpdateItemPicking, 
  useCompletePicking, 
  useUpdateItemPacking, 
  useCompletePacking 
} from '@/hooks/useOrders';
import { Badge, Button } from '@/components/enterprise/BaseInputs';
import { 
  Boxes, 
  Check, 
  Package, 
  Truck, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight, 
  Eye,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export function PickingPackingQueue() {
  const { data: orders = [], isLoading } = useOrders();

  // Mutations
  const startPickingMutation = useStartPicking();
  const updateItemPickingMutation = useUpdateItemPicking();
  const completePickingMutation = useCompletePicking();
  const updateItemPackingMutation = useUpdateItemPacking();
  const completePackingMutation = useCompletePacking();

  // Selected order for focused work
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  // Filter orders needing fulfillment (APPROVED, PROCESSING, PICKING, PACKING)
  const queueOrders = React.useMemo(() => {
    return orders.filter(o => 
      ['APPROVED', 'PROCESSING', 'PICKING', 'PACKING', 'READY_FOR_SHIPPING'].includes(o.status)
    );
  }, [orders]);

  const activeOrder = React.useMemo(() => {
    return queueOrders.find(o => o.id === selectedOrderId) || null;
  }, [queueOrders, selectedOrderId]);

  // Set default selection when data loads
  React.useEffect(() => {
    if (queueOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(queueOrders[0].id);
    }
  }, [queueOrders, selectedOrderId]);

  const handleStartPicking = (orderId: string) => {
    startPickingMutation.mutate(orderId);
  };

  const handleItemPickChange = (orderId: string, itemId: string, status: 'PICKED' | 'SHORTAGE' | 'PENDING') => {
    updateItemPickingMutation.mutate({ orderId, itemId, status });
  };

  const handleCompletePicking = (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;
    
    const unpicked = o.items.filter(it => it.pickingStatus === 'PENDING').length;
    if (unpicked > 0) {
      toast.error(`Cannot complete picking. ${unpicked} items are still marked as PENDING. Please audit item states.`);
      return;
    }

    completePickingMutation.mutate(orderId);
  };

  const handleItemPackChange = (orderId: string, itemId: string, status: 'PACKED' | 'DAMAGED' | 'PENDING') => {
    updateItemPackingMutation.mutate({ orderId, itemId, status });
  };

  const handleCompletePacking = (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;

    const unpacked = o.items.filter(it => it.packingStatus === 'PENDING').length;
    if (unpacked > 0) {
      toast.error(`Cannot seal cargo. ${unpacked} items are still marked as PENDING. Please audit packaging states.`);
      return;
    }

    completePackingMutation.mutate(orderId);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
        <Boxes className="w-8 h-8 animate-bounce text-indigo-500" />
        <span>Syncing Warehouse Stock Queues...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="picking-packing-root">
      
      {/* 1. Left hand: Queue Sidebar List */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs flex flex-col max-h-[700px]">
        <div className="bg-slate-50 dark:bg-zinc-850 border-b border-slate-200 dark:border-zinc-800 py-3.5 px-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-50 flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-indigo-500" />
            Fulfillment Backlog ({queueOrders.length})
          </h4>
        </div>

        {queueOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2.5 flex-1">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
            <p className="font-bold text-xs">All backlogs cleared.</p>
            <p className="text-[10px] text-slate-500 font-medium">No pending stock extractions registered.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 overflow-y-auto flex-1">
            {queueOrders.map((o) => {
              const active = selectedOrderId === o.id;
              let sColor = 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300';
              if (o.status === 'APPROVED' || o.status === 'PROCESSING') sColor = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20';
              if (o.status === 'PICKING') sColor = 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/20';
              if (o.status === 'PACKING') sColor = 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/20';
              if (o.status === 'READY_FOR_SHIPPING') sColor = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20';

              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`w-full text-left p-4 transition-all flex items-center justify-between border-l-4 ${
                    active 
                      ? 'bg-slate-50/70 dark:bg-zinc-850/40 border-indigo-500' 
                      : 'border-transparent hover:bg-slate-50/30'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <p className="font-mono font-bold text-slate-800 dark:text-zinc-100 text-xs leading-none">{o.orderNumber}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{o.customerName}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{o.items.length} items | {o.shippingMethod}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wide border ${sColor}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Right hand: Dedicated Work Desk */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeOrder ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
            
            {/* Workbench title header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 gap-4">
              <div>
                <span className="text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider block">Fulfillment Workbench</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-1.5 mt-0.5">
                  <Package className="w-5 h-5 text-indigo-500" />
                  Operator Console: {activeOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400">Carrier: {activeOrder.shippingMethod}</span>
              </div>
            </div>

            {/* Stage Guidance Card */}
            <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 border border-slate-200/60 dark:border-zinc-800 rounded-xl flex gap-3.5 text-xs text-slate-500 leading-normal">
              <Info className="w-4.5 h-4.5 shrink-0 text-indigo-500 mt-0.5" />
              <div>
                {['APPROVED', 'PROCESSING'].includes(activeOrder.status) && (
                  <>
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">Step A: Initiate Stock Extraction</h5>
                    <p className="mt-0.5">Generate the picking map sheet. Pull physical goods from primary storage racks and scan barcodes.</p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleStartPicking(activeOrder.id)}
                      className="mt-2.5 h-8 font-mono text-[11px]"
                      isLoading={startPickingMutation.isPending}
                    >
                      <Boxes className="w-4 h-4 mr-1.5" /> Generate Picking Sheet & Lock
                    </Button>
                  </>
                )}
                {activeOrder.status === 'PICKING' && (
                  <>
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">Step B: Picking Verification Audit</h5>
                    <p className="mt-0.5">Scan product barcodes. Mark items as <span className="text-emerald-600 font-bold">PICKED</span> or flag <span className="text-rose-500 font-bold">SHORTAGES</span> if high-bay stocks are empty.</p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleCompletePicking(activeOrder.id)}
                      className="mt-2.5 h-8 font-mono text-[11px]"
                      isLoading={completePickingMutation.isPending}
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Complete Picking Audit
                    </Button>
                  </>
                )}
                {activeOrder.status === 'PACKING' && (
                  <>
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">Step C: Industrial Packaging Desk</h5>
                    <p className="mt-0.5">Apply shock-proof casing, dynamic buffers, thermal wraps, and seal boxes. Apply printed layout labels.</p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleCompletePacking(activeOrder.id)}
                      className="mt-2.5 h-8 font-mono text-[11px] bg-purple-600 hover:bg-purple-700"
                      isLoading={completePackingMutation.isPending}
                    >
                      <ShieldCheck className="w-4 h-4 mr-1.5" /> Seal Consignment Box
                    </Button>
                  </>
                )}
                {activeOrder.status === 'READY_FOR_SHIPPING' && (
                  <div className="flex flex-col items-start gap-1.5">
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">Step D: Logistics Dispatch Bay</h5>
                    <p className="mt-0.5">Consignment successfully sealed and weighed. Barcodes applied. Placed in loading bay. Waiting for carrier dispatch logs inside the <span className="font-bold">Orders Ledger</span> list view.</p>
                    <Badge variant="success" className="mt-1 flex items-center gap-1 font-mono">
                      <CheckCircle className="w-3.5 h-3.5" /> READY FOR CARRIER DISPATCH MANIFEST
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Active Items list checklist */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-zinc-200 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 pb-2">
                Consigned Cargo Audit Line Items ({activeOrder.items.length})
              </h4>

              <div className="divide-y divide-slate-150 dark:divide-zinc-800 border border-slate-200/60 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/20">
                {activeOrder.items.map((item) => {
                  return (
                    <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100">{item.productName}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">SKU: {item.sku} | Quantity Requested: <b>{item.quantity} units</b></p>
                      </div>

                      {/* WORK BENCH CHECKBOX TOGGLES */}
                      <div className="flex items-center gap-4 shrink-0">
                        {/* 1. PICKING CONTROLS */}
                        {activeOrder.status === 'PICKING' ? (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wide">PICK ACTION</span>
                            <div className="flex gap-1 bg-slate-100 dark:bg-zinc-900 p-0.5 border border-slate-200/50 dark:border-zinc-800 rounded-lg">
                              {(['PENDING', 'PICKED', 'SHORTAGE'] as const).map((pickState) => (
                                <button
                                  type="button"
                                  key={pickState}
                                  onClick={() => handleItemPickChange(activeOrder.id, item.id, pickState)}
                                  className={`px-2.5 py-1 text-[10px] rounded-md font-bold uppercase transition-all ${
                                    item.pickingStatus === pickState
                                      ? pickState === 'PICKED'
                                        ? 'bg-emerald-500 text-white font-extrabold shadow-sm'
                                        : pickState === 'SHORTAGE'
                                        ? 'bg-rose-500 text-white font-extrabold shadow-sm'
                                        : 'bg-white dark:bg-zinc-800 text-slate-600'
                                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200'
                                  }`}
                                >
                                  {pickState}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wide">PICK STATE</span>
                            <Badge variant={item.pickingStatus === 'PICKED' ? 'success' : item.pickingStatus === 'SHORTAGE' ? 'error' : 'neutral'} className="text-[9px]">
                              {item.pickingStatus}
                            </Badge>
                          </div>
                        )}

                        {/* 2. PACKING CONTROLS */}
                        {activeOrder.status === 'PACKING' ? (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wide">PACK ACTION</span>
                            <div className="flex gap-1 bg-slate-100 dark:bg-zinc-900 p-0.5 border border-slate-200/50 dark:border-zinc-800 rounded-lg">
                              {(['PENDING', 'PACKED', 'DAMAGED'] as const).map((packState) => (
                                <button
                                  type="button"
                                  key={packState}
                                  onClick={() => handleItemPackChange(activeOrder.id, item.id, packState)}
                                  className={`px-2.5 py-1 text-[10px] rounded-md font-bold uppercase transition-all ${
                                    item.packingStatus === packState
                                      ? packState === 'PACKED'
                                        ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                                        : packState === 'DAMAGED'
                                        ? 'bg-rose-500 text-white font-extrabold shadow-sm'
                                        : 'bg-white dark:bg-zinc-800 text-slate-600'
                                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200'
                                  }`}
                                >
                                  {packState}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          activeOrder.status !== 'APPROVED' && activeOrder.status !== 'PROCESSING' && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wide">PACK STATE</span>
                              <Badge variant={item.packingStatus === 'PACKED' ? 'success' : item.packingStatus === 'DAMAGED' ? 'error' : 'neutral'} className="text-[9px]">
                                {item.packingStatus}
                              </Badge>
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer metadata box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wide block">Recipient Information</span>
                <p className="font-bold text-slate-800 dark:text-zinc-200 mt-1">{activeOrder.customerName}</p>
                <p className="text-slate-500">{activeOrder.customerPhone} | {activeOrder.customerEmail}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wide block">Shipment Address</span>
                <p className="font-medium text-slate-700 dark:text-zinc-350 mt-1">{activeOrder.shippingAddress.name}</p>
                <p className="text-slate-500 leading-normal">{activeOrder.shippingAddress.addressLine1}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.postalCode}</p>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-16 shadow-xs text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Boxes className="w-12 h-12 text-slate-300 animate-pulse" />
            <p className="font-bold text-sm">Operator Desk Empty</p>
            <p className="text-xs text-slate-500 max-w-sm">Please select an active stock order from the fulfillment backlog queue list to initiate workbench sequences.</p>
          </div>
        )}
      </div>

    </div>
  );
}
