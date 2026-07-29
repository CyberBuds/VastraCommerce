'use client';

import React, { useState } from 'react';
import { CheckCircle2, Plus, AlertTriangle, FileText, Check, X } from 'lucide-react';
import { useGRNsList, useCreateGRNMutation, usePurchaseOrdersList } from '../hooks/useInventory';

export function GRNView() {
  const { data: grns, isLoading } = useGRNsList();
  const { data: pos } = usePurchaseOrdersList();
  const createMutation = useCreateGRNMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState('');
  const [receivedQty, setReceivedQty] = useState(50);
  const [acceptedQty, setAcceptedQty] = useState(49);
  const [rejectedQty, setRejectedQty] = useState(1);
  const [rejectionReason, setRejectionReason] = useState('Packaging damage on arrival');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const po = pos?.find((p) => p.id === selectedPoId);
    if (!po) return;

    await createMutation.mutateAsync({
      poId: po.id,
      poNumber: po.poNumber,
      supplierName: po.supplierName,
      warehouseName: po.warehouseName,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Current Receiving Clerk',
      status: 'completed',
      items: [
        {
          id: `grni-${Date.now()}`,
          productId: po.items[0]?.productId || 'stk-101',
          productName: po.items[0]?.productName || 'Enterprise Item',
          sku: po.items[0]?.sku || 'SKU-ENT-100',
          orderedQty: po.items[0]?.orderedQty || 50,
          receivedQty,
          acceptedQty,
          rejectedQty,
          rejectionReason,
          qualityCheckStatus: rejectedQty > 0 ? 'conditional' : 'passed',
        },
      ],
      totalAccepted: acceptedQty,
      totalRejected: rejectedQty,
      notes: 'QC check verified at receiving bay',
    });

    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Goods Received Notes (GRN)</h1>
          <p className="text-sm text-slate-500">Inbound dock receiving, quality verification, and accepted vs rejected stock logs</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Create Inbound GRN
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Receive Shipment (GRN Entry)</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Purchase Order</label>
                <select
                  required
                  value={selectedPoId}
                  onChange={(e) => setSelectedPoId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                >
                  <option value="">Select PO Reference...</option>
                  {pos?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.poNumber} - {p.supplierName} ({p.warehouseName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Received</label>
                  <input
                    type="number"
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Accepted</label>
                  <input
                    type="number"
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rejected</label>
                  <input
                    type="number"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-rose-700 font-bold"
                  />
                </div>
              </div>

              {rejectedQty > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rejection Reason</label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                  />
                </div>
              )}

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
                  Post GRN Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRN Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">GRN Number</th>
                <th className="py-3 px-4 font-semibold">PO Reference</th>
                <th className="py-3 px-4 font-semibold">Supplier</th>
                <th className="py-3 px-4 font-semibold">Warehouse</th>
                <th className="py-3 px-4 font-semibold text-right">Accepted Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Rejected Qty</th>
                <th className="py-3 px-4 font-semibold">Received Date</th>
                <th className="py-3 px-4 font-semibold">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading GRNs...
                  </td>
                </tr>
              ) : (
                grns?.map((grn) => (
                  <tr key={grn.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{grn.grnNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-600">{grn.poNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{grn.supplierName}</td>
                    <td className="py-3.5 px-4">{grn.warehouseName}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600">{grn.totalAccepted}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600">{grn.totalRejected}</td>
                    <td className="py-3.5 px-4 text-slate-500">{grn.receivedDate}</td>
                    <td className="py-3.5 px-4">{grn.receivedBy}</td>
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
