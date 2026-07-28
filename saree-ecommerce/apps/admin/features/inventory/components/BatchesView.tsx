'use client';

import React from 'react';
import { Layers, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useBatchesList } from '../hooks/useInventory';

export function BatchesView() {
  const { data: batches, isLoading } = useBatchesList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Batch & Lot Control Register</h1>
          <p className="text-sm text-slate-500">Track manufacturing lot numbers, manufacturing dates, and batch level stock allocations</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Batch / Lot Number</th>
                <th className="py-3 px-4 font-semibold">SKU & Item Name</th>
                <th className="py-3 px-4 font-semibold">Warehouse Site</th>
                <th className="py-3 px-4 font-semibold">MFG Date</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold text-right">Batch Quantity</th>
                <th className="py-3 px-4 font-semibold text-center">Batch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading batch registry...
                  </td>
                </tr>
              ) : (
                batches?.map((bat) => (
                  <tr key={bat.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{bat.batchNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {bat.productName}
                      <div className="text-[10px] font-mono text-slate-400">{bat.sku}</div>
                    </td>
                    <td className="py-3.5 px-4">{bat.warehouseName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{bat.mfgDate}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{bat.expiryDate}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">{bat.quantity}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          bat.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bat.status === 'expiring_soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {bat.status.replace('_', ' ')}
                      </span>
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
