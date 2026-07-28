'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart } from 'lucide-react';
import { useInventoryValuation } from '../hooks/useInventory';

export function InventoryValuationView() {
  const [method, setMethod] = useState<'FIFO' | 'LIFO' | 'Weighted Average'>('FIFO');
  const { data: valuation, isLoading } = useInventoryValuation(method);

  if (isLoading || !valuation) {
    return <div className="py-12 text-center text-slate-500">Calculating FIFO/LIFO financial valuations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Accounting & Valuation</h1>
          <p className="text-sm text-slate-500">GAAP & IFRS compliant inventory asset valuation using FIFO, LIFO, and Weighted Average</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {(['FIFO', 'LIFO', 'Weighted Average'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                method === m ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Stock Asset Value</span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-950 font-mono">
            ${valuation.totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-1 block text-xs text-slate-400">Calculated via {valuation.valuationMethod} method</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total On-Hand Units</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{valuation.totalUnits.toLocaleString()}</div>
          <span className="mt-1 block text-xs text-slate-400">Across active warehouse bins</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Carrying Cost</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-700 font-mono">
            ${valuation.inventoryCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-1 block text-xs text-slate-400">Storage, insurance, handling amortized</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Projected Gross Margin</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
            ${valuation.estimatedProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-1 block text-xs text-slate-400">Based on MSRP sale price projections</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Category Asset Allocation</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4 font-semibold">Category Name</th>
                <th className="py-3 px-4 font-semibold text-right">Unit Count</th>
                <th className="py-3 px-4 font-semibold text-right">Assessed Asset Value</th>
                <th className="py-3 px-4 font-semibold text-right">% of Total Inventory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {valuation.categoryBreakdown.map((cat, idx) => {
                const percent = ((cat.value / valuation.totalStockValue) * 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{cat.category}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-800">{cat.count} units</td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-indigo-900">
                      ${cat.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-700">{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
