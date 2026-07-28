'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  AlertTriangle,
  Eye,
  Sliders,
  Download,
} from 'lucide-react';
import { useStockList, useWarehousesList } from '../hooks/useInventory';
import Link from 'next/link';

export function StockListView() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: stockItems, isLoading } = useStockList({
    warehouseId: selectedWarehouse || undefined,
    status: selectedStatus || undefined,
  });
  const { data: warehouses } = useWarehousesList();

  const filtered = stockItems?.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stock Control & Inventory Register</h1>
          <p className="text-sm text-slate-500">Real-time SKU quantities, reserved stock, valuations, and reorder levels</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inventory/stock-adjustments"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Sliders className="h-4 w-4" /> Adjust Stock
          </Link>
          <Link
            href="/dashboard/inventory/stock-transfers"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <ArrowRightLeft className="h-4 w-4" /> Transfer Stock
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Warehouses</option>
            {warehouses?.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Stock Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Warning</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="overstocked">Overstocked</option>
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">SKU & Item Name</th>
                <th className="py-3 px-4 font-semibold">Warehouse Location</th>
                <th className="py-3 px-4 font-semibold">Category / Brand</th>
                <th className="py-3 px-4 font-semibold text-right">Available Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Reserved</th>
                <th className="py-3 px-4 font-semibold text-right">Unit Cost</th>
                <th className="py-3 px-4 font-semibold text-right">Total Valuation</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Loading inventory stock items...
                  </td>
                </tr>
              ) : filtered?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No matching stock items found.
                  </td>
                </tr>
              ) : (
                filtered?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{item.sku}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.warehouseName}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{item.category}</div>
                      <div className="text-[10px] text-slate-400">{item.brand}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                      {item.availableQty}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-500">{item.reservedQty}</td>
                    <td className="py-3.5 px-4 text-right font-mono">${item.unitCost.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-900">
                      ${item.totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          item.status === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'low_stock'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'out_of_stock'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/dashboard/inventory/stock/details/${item.id}`}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </Link>
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
