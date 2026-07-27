'use client';

import * as React from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrderTable } from '@/features/orders/components/OrderTable';
import { ShoppingCart, Boxes, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderListPage() {
  const { data: orders = [], isLoading } = useOrders();

  // Metrics calculating
  const totalCount = orders.length;
  const holdCount = orders.filter(o => o.status === 'HOLD').length;
  const activeUnpaidCount = orders.filter(o => o.paymentStatus === 'UNPAID' && o.status !== 'CANCELLED').length;
  const totalLedgerSum = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6" id="orders-list-viewport">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5.5 h-5.5" />
            Enterprise Contract Order Ledger
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor, inspect, and register client contract acquisitions, financial ledgers, and shipping carrier handovers.
          </p>
        </div>
      </div>

      {/* Stats Bento Deck */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Acquired Orders</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{totalCount} registered</span>
          </div>
          <div className="p-2.5 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-300">
            <Boxes className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Administrative Locks</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{holdCount} on hold</span>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Awaiting payment</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{activeUnpaidCount} unpaid</span>
          </div>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Ledger Val Assets</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">
              ₹{totalLedgerSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Table card wrapper */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
        <OrderTable orders={orders} isLoading={isLoading} />
      </div>
    </div>
  );
}
