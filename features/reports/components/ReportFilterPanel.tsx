'use client';

import * as React from 'react';
import { useReportsStore } from '@/store/reportsStore';
import { Button, Select, Label } from '@/components/enterprise/BaseInputs';
import { DateRangeType } from '@/features/reports/types/reportsTypes';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ReportFilterPanel() {
  const { filters, setFilters, resetFilters } = useReportsStore();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Analytics filters applied across all telemetry widgets.');
  };

  return (
    <form
      onSubmit={handleApply}
      className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/60 shadow-2xs space-y-4 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          Enterprise Analytics Filters
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Time Horizon</Label>
          <Select
            value={filters.dateRange}
            onChange={(e) => setFilters({ dateRange: e.target.value as DateRangeType })}
            className="mt-1 text-xs"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year (YTD)</option>
          </Select>
        </div>

        {/* Store / Outlet */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Store / Channel</Label>
          <Select
            value={filters.storeId || 'ALL'}
            onChange={(e) => setFilters({ storeId: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Channels & Outlets</option>
            <option value="store-main">Main Seattle Flagship</option>
            <option value="store-eu">Frankfurt Enterprise Center</option>
            <option value="store-asia">Singapore Aviation Depot</option>
            <option value="store-online">Global B2B E-Portal</option>
          </Select>
        </div>

        {/* Warehouse */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Warehouse Location</Label>
          <Select
            value={filters.warehouseId || 'ALL'}
            onChange={(e) => setFilters({ warehouseId: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Warehouses</option>
            <option value="wh-seattle">Seattle Main Hub (WH-01)</option>
            <option value="wh-frankfurt">Frankfurt Cargo Hub (WH-02)</option>
            <option value="wh-singapore">Singapore Logistics (WH-03)</option>
          </Select>
        </div>

        {/* Category */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Product Category</Label>
          <Select
            value={filters.categoryId || 'ALL'}
            onChange={(e) => setFilters({ categoryId: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="avionics">Avionics & Radar</option>
            <option value="propulsion">Turbine Propulsion</option>
            <option value="cockpit">Cockpit Controls</option>
            <option value="airframe">Hydraulics & Airframe</option>
            <option value="cabin">Cabin Systems</option>
          </Select>
        </div>

        {/* Brand */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Manufacturer / Brand</Label>
          <Select
            value={filters.brandId || 'ALL'}
            onChange={(e) => setFilters({ brandId: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Manufacturers</option>
            <option value="boeing">Boeing OEM</option>
            <option value="airbus">Airbus SE</option>
            <option value="honeywell">Honeywell Aerospace</option>
            <option value="collins">Collins Aerospace</option>
          </Select>
        </div>

        {/* Customer Group */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Customer Group</Label>
          <Select
            value={filters.customerGroupId || 'ALL'}
            onChange={(e) => setFilters({ customerGroupId: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Customer Segments</option>
            <option value="tier-vip">Tier 1 VIP Defense</option>
            <option value="commercial">Commercial Airlines</option>
            <option value="mro">MRO Service Centers</option>
            <option value="government">Government & Military</option>
          </Select>
        </div>

        {/* Payment Method */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Payment Gateway</Label>
          <Select
            value={filters.paymentMethod || 'ALL'}
            onChange={(e) => setFilters({ paymentMethod: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Payment Gateways</option>
            <option value="stripe">Stripe Credit Card</option>
            <option value="razorpay">Razorpay UPI / NetBanking</option>
            <option value="paypal">PayPal Corporate</option>
            <option value="wire">Direct Bank Wire / ACH</option>
          </Select>
        </div>

        {/* Order Status */}
        <div>
          <Label className="text-[11px] text-slate-500 font-bold uppercase">Order Lifecycle</Label>
          <Select
            value={filters.orderStatus || 'ALL'}
            onChange={(e) => setFilters({ orderStatus: e.target.value })}
            className="mt-1 text-xs"
          >
            <option value="ALL">All Lifecycle States</option>
            <option value="COMPLETED">Completed / Delivered</option>
            <option value="PROCESSING">Processing / Picking</option>
            <option value="PENDING">Pending Payment</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned / Refunded</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="sm" className="font-bold gap-1.5 text-xs">
          <Check className="w-3.5 h-3.5" /> Apply Filter Context
        </Button>
      </div>
    </form>
  );
}
