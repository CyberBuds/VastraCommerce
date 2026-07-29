'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Search,
  Bell,
  Package,
  DollarSign,
  ChevronRight,
  Store,
} from 'lucide-react';

export function DashboardPreview() {
  return (
    <div className="relative w-full h-full min-h-[640px] bg-slate-900/95 text-slate-100 p-6 xl:p-8 flex flex-col justify-between overflow-hidden select-none border-l border-slate-800">
      {/* Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar preview */}
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                VastraCommerce Store
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </p>
              <p className="text-[10px] text-slate-400">Live Production Sync • v2.4</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-[11px] text-slate-400">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search orders, products...</span>
              <kbd className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">⌘K</kbd>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 text-slate-400 relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Total Revenue</span>
              <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                +14.2% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 text-lg xl:text-xl font-extrabold text-white tracking-tight">
              $128,450.00
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">3,420 orders fulfilled</p>
          </motion.div>

          {/* Today's Orders */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Today&apos;s Orders</span>
              <span className="flex items-center gap-0.5 text-blue-400 font-bold">
                +8.5% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 text-lg xl:text-xl font-extrabold text-white tracking-tight">
              1,284
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">$42.50 Avg. Order Value</p>
          </motion.div>

          {/* Pending Shipments */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Pending Processing</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Action Req.
              </span>
            </div>
            <div className="mt-1.5 text-lg xl:text-xl font-extrabold text-white tracking-tight">
              42 Orders
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Avg response &lt; 15 mins</p>
          </motion.div>
        </div>

        {/* Visual Chart & Analytics Row */}
        <div className="grid grid-cols-12 gap-3">
          {/* Revenue Analytics Chart Mock */}
          <div className="col-span-7 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                  Sales Performance
                </h3>
                <p className="text-[10px] text-slate-400">Hourly revenue trajectory today</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-700/50 text-slate-300">
                <span>Real-time</span>
              </div>
            </div>

            {/* Sparkline Visual Bars */}
            <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
              {[40, 55, 35, 65, 80, 50, 90, 75, 95, 110, 85, 120, 105, 130].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm group-hover:brightness-125 transition-all"
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-700/40">
              <span>08:00 AM</span>
              <span>12:00 PM</span>
              <span>04:00 PM</span>
              <span>08:00 PM</span>
            </div>
          </div>

          {/* Top Selling & Low Stock Alerts */}
          <div className="col-span-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  Top Seller
                </h3>
                <span className="text-[10px] font-bold text-emerald-400">98.4% in stock</span>
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/40 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">Handloom Silk Sari</p>
                  <p className="text-[10px] text-slate-400">412 sold • $180.00 unit</p>
                </div>
              </div>
            </div>

            {/* Low Stock Warning Pill */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="font-bold text-[10px]">Low Inventory Alert</p>
                <p className="text-[9px] text-amber-300/80 truncate">2 items remaining in Silk Collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Order Activity Timeline Feed */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Live Order Activity Stream
            </h3>
            <span className="text-[10px] text-slate-400">Auto-refreshing</span>
          </div>

          <div className="space-y-2">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">#VC-9842</span>
                <span className="text-slate-400 truncate">Priya Sharma • Royal Linen Kurta</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-extrabold text-emerald-400">$249.00</span>
                <span className="text-[9px] text-slate-500">2m ago</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="font-bold text-white">#VC-9841</span>
                <span className="text-slate-400 truncate">Ankit Verma • Chanderi Dupatta</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-extrabold text-blue-400">$120.00</span>
                <span className="text-[9px] text-slate-500">7m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Overlay Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-xl backdrop-blur-md border border-blue-400/30 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-extrabold">Unified Multi-Store Control</p>
            <p className="text-[10px] text-blue-100/90">Inventory, Orders, & Analytics synced in real-time</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-xl bg-white text-blue-700 text-xs font-bold flex items-center gap-1 shadow-xs">
          <span>Explore</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </motion.div>
    </div>
  );
}
