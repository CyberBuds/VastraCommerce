'use client';

import React from 'react';
import { Layers, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { usePurchaseOrdersList, useUpdatePOStatusMutation } from '../hooks/useInventory';
import Link from 'next/link';

export function PurchaseOrdersListView() {
  const { data: pos, isLoading } = usePurchaseOrdersList();
  const updatePOStatus = useUpdatePOStatusMutation();

  const handleApprove = async (id: string) => {
    await updatePOStatus.mutateAsync({ id, status: 'approved' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Orders & Procurement Ledger</h1>
          <p className="text-sm text-slate-500">Manage supplier purchasing requests, status approvals, and expected inbound dates</p>
        </div>
        <Link
          href="/dashboard/inventory/purchase-orders/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Create Purchase Order
        </Link>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">PO Number</th>
                <th className="py-3 px-4 font-semibold">Supplier</th>
                <th className="py-3 px-4 font-semibold">Warehouse Site</th>
                <th className="py-3 px-4 font-semibold">Expected Delivery</th>
                <th className="py-3 px-4 font-semibold text-right">Grand Total</th>
                <th className="py-3 px-4 font-semibold">Approval Status</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading purchase orders...
                  </td>
                </tr>
              ) : (
                pos?.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{po.poNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{po.supplierName}</td>
                    <td className="py-3.5 px-4">{po.warehouseName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{po.expectedDeliveryDate}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${po.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {po.approvalWorkflowStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          po.status === 'approved' || po.status === 'received'
                            ? 'bg-emerald-100 text-emerald-800'
                            : po.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {po.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {po.status === 'pending_approval' && (
                        <button
                          onClick={() => handleApprove(po.id)}
                          className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Approve PO
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
