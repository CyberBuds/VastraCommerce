'use client';

import React from 'react';
import { Tag, ShieldAlert, History, CheckCircle } from 'lucide-react';
import { useSerialNumbersList } from '../hooks/useInventory';

export function SerialNumbersView() {
  const { data: serials, isLoading } = useSerialNumbersList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Serial Number Tracking & Lifecycle</h1>
          <p className="text-sm text-slate-500">Individual unit serialization for warranty tracking, equipment dispatch, and anti-counterfeiting</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Serial Number</th>
                <th className="py-3 px-4 font-semibold">SKU & Product</th>
                <th className="py-3 px-4 font-semibold">Warehouse Location</th>
                <th className="py-3 px-4 font-semibold">Assigned Date</th>
                <th className="py-3 px-4 font-semibold">Unit Lifecycle Status</th>
                <th className="py-3 px-4 font-semibold">Last Action Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading serial numbers...
                  </td>
                </tr>
              ) : (
                serials?.map((ser) => (
                  <tr key={ser.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ser.serialNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {ser.productName}
                      <div className="text-[10px] font-mono text-slate-400">{ser.sku}</div>
                    </td>
                    <td className="py-3.5 px-4">{ser.warehouseName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{ser.assignedDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          ser.currentStatus === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ser.currentStatus === 'reserved'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ser.currentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {ser.history[ser.history.length - 1]?.action || 'Initial Registration'}
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
