'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Truck, CheckCircle2, Clock } from 'lucide-react';
import {
  useStockTransfersList,
  useCreateStockTransferMutation,
  useUpdateTransferStatusMutation,
  useWarehousesList,
  useStockList,
} from '../hooks/useInventory';

export function StockTransfersView() {
  const { data: transfers, isLoading } = useStockTransfersList();
  const { data: warehouses } = useWarehousesList();
  const { data: stockItems } = useStockList();

  const createMutation = useCreateStockTransferMutation();
  const updateStatusMutation = useUpdateTransferStatusMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [sourceWh, setSourceWh] = useState('');
  const [targetWh, setTargetWh] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [qty, setQty] = useState(1);
  const [trackingNo, setTrackingNo] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const src = warehouses?.find((w) => w.id === sourceWh);
    const tgt = warehouses?.find((w) => w.id === targetWh);
    const st = stockItems?.find((s) => s.id === selectedStock);

    if (!src || !tgt || !st) return;

    await createMutation.mutateAsync({
      sourceWarehouseId: sourceWh,
      sourceWarehouseName: src.name,
      targetWarehouseId: targetWh,
      targetWarehouseName: tgt.name,
      items: [
        {
          productId: st.id,
          productName: st.productName,
          sku: st.sku,
          quantity: qty,
        },
      ],
      status: 'in_transit',
      trackingNumber: trackingNo || `TRK-EXPRESS-${Math.floor(100000 + Math.random() * 900000)}`,
      requestedBy: 'Current Dispatcher',
    });

    setIsOpen(false);
  };

  const handleStatusUpdate = async (id: string, status: any) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inter-Warehouse Stock Transfers</h1>
          <p className="text-sm text-slate-500">Track multi-facility logistics shipment status, waybills, and transit dispatch</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Initiate Stock Transfer
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Initiate Inter-Facility Transfer</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Source Warehouse</label>
                  <select
                    required
                    value={sourceWh}
                    onChange={(e) => setSourceWh(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                  >
                    <option value="">Select Origin...</option>
                    {warehouses?.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destination Warehouse</label>
                  <select
                    required
                    value={targetWh}
                    onChange={(e) => setTargetWh(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                  >
                    <option value="">Select Target...</option>
                    {warehouses?.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Item to Transfer</label>
                <select
                  required
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                >
                  <option value="">Select Product...</option>
                  {stockItems?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.productName} ({s.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Carrier Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. TRK-FEDEX-99182"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfers Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Transfer Ref #</th>
                <th className="py-3 px-4 font-semibold">Origin → Destination</th>
                <th className="py-3 px-4 font-semibold">Items & Qty</th>
                <th className="py-3 px-4 font-semibold">Tracking #</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Created Date</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading transfer manifests...
                  </td>
                </tr>
              ) : (
                transfers?.map((trf) => (
                  <tr key={trf.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{trf.transferNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{trf.sourceWarehouseName}</div>
                      <div className="text-[10px] text-slate-400">→ {trf.targetWarehouseName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {trf.items.map((it, idx) => (
                        <div key={idx}>
                          <span className="font-medium text-slate-800">{it.productName}</span> ({it.quantity} units)
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{trf.trackingNumber}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          trf.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trf.status === 'in_transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {trf.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{trf.createdAt}</td>
                    <td className="py-3.5 px-4 text-center">
                      {trf.status === 'in_transit' && (
                        <button
                          onClick={() => handleStatusUpdate(trf.id, 'completed')}
                          className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Mark Received
                        </button>
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
  );
}
