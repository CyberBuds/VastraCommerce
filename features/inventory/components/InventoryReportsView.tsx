'use client';

import React, { useState } from 'react';
import { Download, FileText, BarChart3, PieChart, LineChart } from 'lucide-react';

export function InventoryReportsView() {
  const [reportType, setReportType] = useState('stock_summary');

  const reports = [
    {
      id: 'stock_summary',
      name: 'Stock Health & Aging Report',
      description: 'Comprehensive analysis of dead stock, slow-moving items, and stock turn ratio',
    },
    {
      id: 'valuation_ledger',
      name: 'Inventory Valuation & Asset Balance Sheet',
      description: 'FIFO / LIFO tax audit ledger with historical acquisition costs',
    },
    {
      id: 'warehouse_utilization',
      name: 'Warehouse Bin & Capacity Utilization',
      description: 'Aisle square footage usage, bin density, and picking route optimizations',
    },
    {
      id: 'supplier_fulfillment',
      name: 'Supplier Fulfillment & Lead Time SLA',
      description: 'On-time delivery percentages, defect ratios, and vendor scorecards',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Analytics & Reports</h1>
          <p className="text-sm text-slate-500">Export audit statements, turnover metrics, and warehouse throughput reports</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {reports.map((rep) => (
          <div key={rep.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{rep.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{rep.description}</p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => alert(`Downloading CSV report for ${rep.name}...`)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
              <button
                onClick={() => alert(`Generating PDF report for ${rep.name}...`)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
