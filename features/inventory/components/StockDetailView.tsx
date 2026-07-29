'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Boxes,
  Warehouse,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Tag,
  Clock,
  Layers,
  History,
} from 'lucide-react';
import { useStockItemById, useStockMovementsList } from '../hooks/useInventory';

interface StockDetailProps {
  id: string;
}

export function StockDetailView({ id }: StockDetailProps) {
  const router = useRouter();
  const { data: item, isLoading } = useStockItemById(id);
  const { data: movements } = useStockMovementsList();

  const itemMovements = movements?.filter((m) => m.productId === id);

  if (isLoading || !item) {
    return <div className="py-12 text-center text-slate-500">Loading SKU details...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{item.productName}</h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">
              {item.sku}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Category: {item.category} • Brand: {item.brand} • Warehouse: {item.warehouseName}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Available Quantity</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{item.availableQty} units</div>
          <div className="mt-1 text-xs text-slate-400">Reorder Level: {item.reorderLevel}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Reserved / Quarantined</div>
          <div className="mt-2 text-2xl font-black text-amber-700">{item.reservedQty} reserved</div>
          <div className="mt-1 text-xs text-rose-500">{item.damagedQty} damaged</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Unit Cost</div>
          <div className="mt-2 text-2xl font-black text-indigo-900">${item.unitCost.toFixed(2)}</div>
          <div className="mt-1 text-xs text-slate-400">Total Valuation: ${item.totalValuation.toLocaleString()}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Inbound Pipeline</div>
          <div className="mt-2 text-2xl font-black text-emerald-600">+{item.incomingQty} expected</div>
          <div className="mt-1 text-xs text-slate-400">Last Restocked: {item.lastRestocked}</div>
        </div>
      </div>

      {/* SKU Attributes & Barcode Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Tag className="h-4 w-4 text-indigo-600" />
            Stock Ledger & Specifications
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Primary Barcode / EAN</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{item.barcode}</span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Storage Site</span>
              <span className="font-semibold text-slate-800 text-sm">{item.warehouseName}</span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Inventory Status</span>
              <span className="font-bold uppercase text-emerald-600 text-sm">{item.status.replace('_', ' ')}</span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Outgoing Scheduled</span>
              <span className="font-bold text-slate-800 text-sm">{item.outgoingQty} units</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <QrCode className="h-20 w-20 text-slate-800" />
          <div className="mt-2 text-xs font-mono font-bold text-slate-600">{item.barcode}</div>
          <p className="mt-1 text-[11px] text-slate-400">Generated Code 128 Scan Format</p>
        </div>
      </div>

      {/* Audit History Log */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
          <History className="h-4 w-4 text-indigo-600" />
          Movement History & Audit Log for {item.sku}
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Reference No</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itemMovements && itemMovements.length > 0 ? (
                itemMovements.map((mov) => (
                  <tr key={mov.id}>
                    <td className="py-2.5 px-3 font-semibold uppercase">{mov.type}</td>
                    <td className={`py-2.5 px-3 font-bold ${mov.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {mov.quantity}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{mov.referenceNo}</td>
                    <td className="py-2.5 px-3">{mov.reason}</td>
                    <td className="py-2.5 px-3">{mov.performedBy}</td>
                    <td className="py-2.5 px-3 text-slate-400">{mov.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No recent audit logs recorded for this SKU.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
