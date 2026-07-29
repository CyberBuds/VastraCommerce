'use client';

import React from 'react';
import {
  Warehouse,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Boxes,
  Truck,
  Layers,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useInventoryStats, useWarehousesList, useStockList, useStockMovementsList } from '../hooks/useInventory';
import Link from 'next/link';

export function InventoryDashboardView() {
  const { data: stats, isLoading: statsLoading } = useInventoryStats();
  const { data: warehouses } = useWarehousesList();
  const { data: stockItems } = useStockList();
  const { data: movements } = useStockMovementsList();

  if (statsLoading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Inventory Valuation',
      value: `$${stats.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+4.2% vs last month',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Active SKUs Available',
      value: stats.totalStock.toLocaleString(),
      change: `${stats.availableStock} physically in stock`,
      isPositive: true,
      icon: Package,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Low / Out of Stock',
      value: `${stats.lowStockCount + stats.outOfStockCount}`,
      change: `${stats.outOfStockCount} critical out-of-stock`,
      isPositive: false,
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Active Warehouses',
      value: stats.warehouseCount.toString(),
      change: 'Avg capacity 70.5%',
      isPositive: true,
      icon: Warehouse,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory & Warehouse Control Center</h1>
          <p className="text-sm text-slate-500">Real-time stock valuation, warehouse capacities, and fulfillment logistics</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inventory/stock"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Boxes className="h-4 w-4" /> Stock Register
          </Link>
          <Link
            href="/dashboard/inventory/stock-transfers"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Truck className="h-4 w-4" /> Initiate Transfer
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
                <div className={`rounded-lg border p-2 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-slate-900">{card.value}</div>
                <div className="mt-1 flex items-center text-xs font-medium text-slate-500">
                  {card.isPositive ? (
                    <ArrowUpRight className="mr-0.5 h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="mr-0.5 h-3.5 w-3.5 text-rose-600" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Warehouses Capacity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Warehouse Utilization */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Warehouse Capacity Utilization</h2>
              <p className="text-xs text-slate-500">Current floor space and SKU distribution across facilities</p>
            </div>
            <Link href="/dashboard/inventory/warehouses" className="text-xs font-medium text-indigo-600 hover:underline">
              Manage All →
            </Link>
          </div>

          <div className="space-y-4">
            {warehouses?.map((wh) => (
              <div key={wh.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <Warehouse className="h-4 w-4 text-indigo-600" />
                    <span>{wh.name}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">{wh.code}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    {wh.currentCapacityPercent}% Occupied ({wh.totalSKUs} SKUs)
                  </div>
                </div>

                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      wh.currentCapacityPercent > 80
                        ? 'bg-rose-500'
                        : wh.currentCapacityPercent > 65
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${wh.currentCapacityPercent}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Manager: {wh.manager}</span>
                  <span>
                    Location: {wh.city}, {wh.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Quick Hub */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Fulfillment Quick Actions</h2>
            <p className="text-xs text-slate-500">Direct shortcuts to inventory operational workflows</p>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/dashboard/inventory/purchase-orders/new"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded bg-blue-100 p-1.5 text-blue-700">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span>Create Purchase Order</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/inventory/grn"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded bg-emerald-100 p-1.5 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Receive Goods Note (GRN)</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/inventory/stock-adjustments"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded bg-amber-100 p-1.5 text-amber-700">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span>Stock Adjustment & Audit</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/inventory/inventory-valuation"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded bg-purple-100 p-1.5 text-purple-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span>FIFO / LIFO Valuation</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-indigo-50 p-4 text-xs text-indigo-900 border border-indigo-100">
            <span className="font-semibold">Pro Tip:</span> Batch cycle counts scheduled for 1st of next month. Review warehouse bin allocations.
          </div>
        </div>
      </div>

      {/* Bottom Section: Stock Movements Log */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Stock Movements</h2>
            <p className="text-xs text-slate-500">Live audit log of inbound, outbound, and inter-hub transfers</p>
          </div>
          <Link href="/dashboard/inventory/stock" className="text-xs font-medium text-indigo-600 hover:underline">
            View Full Stock Log →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">SKU & Item</th>
                <th className="py-3 px-4 font-semibold">Warehouse</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Quantity</th>
                <th className="py-3 px-4 font-semibold">Ref Number</th>
                <th className="py-3 px-4 font-semibold">Performed By</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {movements?.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {mov.productName}
                    <div className="text-[10px] text-slate-400 font-mono">{mov.sku}</div>
                  </td>
                  <td className="py-3 px-4">{mov.warehouseName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        mov.type === 'stock_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mov.type === 'transfer'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mov.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`py-3 px-4 font-bold ${mov.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{mov.referenceNo}</td>
                  <td className="py-3 px-4">{mov.performedBy}</td>
                  <td className="py-3 px-4 text-slate-400">{mov.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
