'use client';

import React from 'react';
import { Clock, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { useExpiryAlertsList } from '../hooks/useInventory';

export function ExpiryManagementView() {
  const { data: alerts, isLoading } = useExpiryAlertsList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Perishables & Expiry Management</h1>
          <p className="text-sm text-slate-500">FEFO (First-Expired, First-Out) shelf-life monitoring, quarantine alerts, and markdown triggers</p>
        </div>
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {isLoading ? (
          <div className="col-span-2 text-center py-8 text-slate-500">Loading shelf-life risk alerts...</div>
        ) : (
          alerts?.map((exp) => (
            <div
              key={exp.id}
              className={`rounded-xl border p-5 shadow-sm space-y-3 ${
                exp.riskLevel === 'critical'
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-amber-200 bg-amber-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-600">{exp.sku}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                    exp.riskLevel === 'critical' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  {exp.riskLevel} Risk • {exp.daysToExpiry} Days Remaining
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{exp.productName}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>Batch #: <strong className="text-slate-800 font-mono">{exp.batchNumber}</strong></div>
                <div>Warehouse: <strong className="text-slate-800">{exp.warehouseName}</strong></div>
                <div>Expiry Date: <strong className="text-rose-700 font-bold">{exp.expiryDate}</strong></div>
                <div>Affected Stock: <strong className="text-slate-900 font-bold">{exp.quantity} units</strong></div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200/60">
                <button
                  onClick={() => alert(`Marked ${exp.productName} for expedited clearance markdown`)}
                  className="rounded bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Apply Clear-Out Discount
                </button>
                <button
                  onClick={() => alert(`Quarantined ${exp.quantity} units of ${exp.batchNumber}`)}
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                >
                  Quarantine Batch
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
