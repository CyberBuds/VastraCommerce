'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  PieChart, 
  FileText,
  Percent,
  Warehouse,
  Sparkles,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

function ValuationContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { stock, warehouses } = useInventoryStore();

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Valuation & Financial Reports' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Pricing helper per SKU
  const getSkuPrice = (sku: string) => {
    if (sku.endsWith('10000')) return 950;
    if (sku.endsWith('10001')) return 12.5;
    if (sku.endsWith('10002')) return 180;
    if (sku.endsWith('10003')) return 450;
    if (sku.endsWith('10004')) return 1200;
    return 100;
  };

  // Calculate stats
  const totalAssetsValuation = stock.reduce((sum, item) => {
    const price = getSkuPrice(item.sku);
    return sum + (item.available * price);
  }, 0);

  const totalReservedValuation = stock.reduce((sum, item) => {
    const price = getSkuPrice(item.sku);
    return sum + (item.reserved * price);
  }, 0);

  const totalDamageLoss = stock.reduce((sum, item) => {
    const price = getSkuPrice(item.sku);
    return sum + (item.damaged * price);
  }, 0);

  const totalAssetCount = stock.reduce((sum, item) => sum + item.available, 0);

  // Group valuation per Warehouse
  const valuationByWarehouse = warehouses.map(wh => {
    const whStock = stock.filter(s => s.warehouseId === wh.id);
    const value = whStock.reduce((sum, item) => {
      const price = getSkuPrice(item.sku);
      return sum + (item.available * price);
    }, 0);

    const share = totalAssetsValuation > 0 ? parseFloat(((value / totalAssetsValuation) * 100).toFixed(1)) : 0;

    return {
      name: wh.name,
      code: wh.code,
      value,
      share,
    };
  });

  // Group valuation by Category
  const categories = Array.from(new Set(stock.map(s => s.category)));
  const valuationByCategory = categories.map(cat => {
    const catStock = stock.filter(s => s.category === cat);
    const value = catStock.reduce((sum, item) => {
      const price = getSkuPrice(item.sku);
      return sum + (item.available * price);
    }, 0);

    const share = totalAssetsValuation > 0 ? parseFloat(((value / totalAssetsValuation) * 100).toFixed(1)) : 0;

    return {
      category: cat,
      value,
      share,
    };
  });

  const handleExportStatement = () => {
    toast.success('Statement Exported! PDF and CSV ledger compiled and sent to your email.');
  };

  return (
    <div className="space-y-6" id="valuation-reports-root">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Inventory Valuation & Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Analyze the carrying cost of raw goods and assemblies. Perform real-time audits on multi-site holdings for financial bookkeeping.
          </p>
        </div>
        <div>
          <Button variant="primary" size="sm" onClick={handleExportStatement}>
            <FileText className="w-4 h-4 mr-1.5" />
            Export Audit Ledger
          </Button>
        </div>
      </div>

      {/* Financial high-level indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Gross Asset Carry Value</span>
          <p className="text-lg font-extrabold font-mono text-slate-900 dark:text-zinc-50">
            ₹{totalAssetsValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4% vs previous week
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Locked Reserves Capital</span>
          <p className="text-lg font-extrabold font-mono text-slate-900 dark:text-zinc-50">
            ₹{totalReservedValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="text-[10px] text-slate-400 font-semibold">
            Capital allocated to active contract reserves
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Damage Write-Off Losses</span>
          <p className="text-lg font-extrabold font-mono text-rose-500">
            ₹{totalDamageLoss.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="text-[10px] text-rose-500 font-semibold flex items-center">
            <TrendingDown className="w-3 h-3 mr-0.5" /> -0.8% salvage offset
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Aggregate Asset Count</span>
          <p className="text-lg font-extrabold font-mono text-slate-900 dark:text-zinc-50">
            {totalAssetCount.toLocaleString()} units
          </p>
          <div className="text-[10px] text-slate-400 font-semibold">
            Aggregate physical inventory pieces
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Warehouse holdings share */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <Warehouse className="w-4 h-4 mr-1.5" />
            Capital Allocation Share per Site
          </h3>

          <div className="space-y-4 pt-2">
            {valuationByWarehouse.map((wh, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-zinc-200">{wh.name}</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-zinc-100">
                    ₹{wh.value.toLocaleString()} ({wh.share}%)
                  </span>
                </div>
                {/* Simulated bar chart progress */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${wh.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category holdings share */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
            <PieChart className="w-4 h-4 mr-1.5" />
            Capital Allocation Share per Category
          </h3>

          <div className="space-y-4 pt-2">
            {valuationByCategory.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-zinc-200">{cat.category}</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-zinc-100">
                    ₹{cat.value.toLocaleString()} ({cat.share}%)
                  </span>
                </div>
                {/* Simulated bar chart progress */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ValuationPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <ValuationContent />
      </AdminLayout>
    </AppProviders>
  );
}
