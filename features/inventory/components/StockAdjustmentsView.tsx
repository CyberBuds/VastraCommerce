'use client';

import React, { useState } from 'react';
import { Sliders, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  useStockAdjustmentsList,
  useCreateStockAdjustmentMutation,
  useStockList,
  useWarehousesList,
} from '../hooks/useInventory';

export function StockAdjustmentsView() {
  const { data: adjustments, isLoading } = useStockAdjustmentsList();
  const { data: stockItems } = useStockList();
  const { data: warehouses } = useWarehousesList();
  const createMutation = useCreateStockAdjustmentMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedWh, setSelectedWh] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [newQty, setNewQty] = useState(0);
  const [reason, setReason] = useState('');
  const [reasonCategory, setReasonCategory] = useState<any>('cycle_count_discrepancy');

  const activeStock = stockItems?.find((s) => s.id === selectedStock);
  const previousQty = activeStock ? activeStock.availableQty : 0;
  const diffQty = newQty - previousQty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStock || !selectedWh) return;

    const wh = warehouses?.find((w) => w.id === selectedWh);

    await createMutation.mutateAsync({
      warehouseId: selectedWh,
      warehouseName: wh ? wh.name : 'Central Warehouse',
      items: [
        {
          productId: activeStock.id,
          productName: activeStock.productName,
          sku: activeStock.sku,
          previousQty,
          newQty,
          adjustmentQty: diffQty,
          type: diffQty >= 0 ? 'increase' : 'decrease',
          reason,
        },
      ],
      status: 'approved',
      reasonCategory,
      totalAdjustmentValue: diffQty * activeStock.unitCost,
      requestedBy: 'Current User (Admin)',
      approvedBy: 'Robert Vance',
    });

    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stock Adjustments & Audit Reconciliations</h1>
          <p className="text-sm text-slate-500">Record stock count variances, spoilage, or damage adjustments</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New Stock Adjustment
        </button>
      </div>

      {/* Modal for New Adjustment */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Perform Stock Adjustment</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Warehouse</label>
                <select
                  required
                  value={selectedWh}
                  onChange={(e) => setSelectedWh(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                >
                  <option value="">Select Warehouse...</option>
                  {warehouses?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Item SKU</label>
                <select
                  required
                  value={selectedStock}
                  onChange={(e) => {
                    setSelectedStock(e.target.value);
                    const st = stockItems?.find((s) => s.id === e.target.value);
                    if (st) setNewQty(st.availableQty);
                  }}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                >
                  <option value="">Select Stock Item...</option>
                  {stockItems?.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.productName} ({st.sku}) - Current: {st.availableQty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Current Stock</label>
                  <input
                    type="number"
                    disabled
                    value={previousQty}
                    className="w-full rounded-lg bg-slate-100 border border-slate-200 p-2 text-sm font-bold text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Actual Physical Count</label>
                  <input
                    type="number"
                    required
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm font-bold text-indigo-900"
                  />
                </div>
              </div>

              <div className="rounded bg-slate-50 p-2.5 text-xs text-slate-700 font-medium">
                Variance: <strong className={diffQty >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{diffQty > 0 ? `+${diffQty}` : diffQty} units</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reason Category</label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                >
                  <option value="cycle_count_discrepancy">Cycle Count Discrepancy</option>
                  <option value="damage">Physical Damage</option>
                  <option value="spoilage">Spoilage / Expiry</option>
                  <option value="theft">Theft / Loss</option>
                  <option value="audit_reconciliation">Audit Reconciliation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Explanation</label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900 h-20"
                />
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
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjustments Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Adjustment #</th>
                <th className="py-3 px-4 font-semibold">Warehouse</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Items Adjusted</th>
                <th className="py-3 px-4 font-semibold text-right">Value Impact</th>
                <th className="py-3 px-4 font-semibold">Requested By</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading stock adjustments...
                  </td>
                </tr>
              ) : (
                adjustments?.map((adj) => (
                  <tr key={adj.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{adj.adjustmentNumber}</td>
                    <td className="py-3.5 px-4">{adj.warehouseName}</td>
                    <td className="py-3.5 px-4 font-medium capitalize text-slate-800">
                      {adj.reasonCategory.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      {adj.items.map((item, idx) => (
                        <div key={idx}>
                          <span className="font-semibold text-slate-900">{item.productName}</span> ({item.adjustmentQty > 0 ? `+${item.adjustmentQty}` : item.adjustmentQty})
                        </div>
                      ))}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold ${adj.totalAdjustmentValue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${adj.totalAdjustmentValue.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">{adj.requestedBy}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                        {adj.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{adj.createdAt}</td>
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
