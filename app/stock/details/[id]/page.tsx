'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, StockItem } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  History, 
  Layers, 
  Tags, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

function StockDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { stock, stockMovements, adjustStockLevel } = useInventoryStore();

  // Load item
  const item = React.useMemo(() => {
    if (!id) return null;
    return stock.find(s => s.id === id) || null;
  }, [id, stock]);

  React.useEffect(() => {
    if (id && !item) {
      toast.error('Stock item record not found.');
      router.push('/stock');
    }
  }, [id, item, router]);

  React.useEffect(() => {
    if (item) {
      setBreadcrumbs([
        { label: 'Inventory', href: '/inventory/dashboard' },
        { label: 'Stock Control', href: '/stock' },
        { label: `Details - ${item.sku}` }
      ]);
      setActiveMenuId('inventory');
    }
  }, [item, setBreadcrumbs, setActiveMenuId]);

  const handleReportDamage = () => {
    if (!item) return;
    const qty = parseInt(prompt('Enter quantity damaged (moves from available to damaged):', '1') || '0');
    if (qty <= 0) return;
    if (item.available < qty) {
      toast.error('Cannot report damage for more units than currently available.');
      return;
    }

    adjustStockLevel(item.warehouseId, item.sku, 'DAMAGE', qty, 'Damaged stock found during floor walk.', 'DAM-LOG');
    toast.success(`${qty} units of ${item.productName} logged as damaged.`);
  };

  const handleReleaseReserve = () => {
    if (!item) return;
    if (item.reserved <= 0) {
      toast.error('No stock is currently locked in reserve.');
      return;
    }
    const qty = parseInt(prompt(`Enter quantity to release back to Available (max ${item.reserved}):`, String(item.reserved)) || '0');
    if (qty <= 0) return;
    if (item.reserved < qty) {
      toast.error('Cannot release more units than currently reserved.');
      return;
    }

    adjustStockLevel(item.warehouseId, item.sku, 'RELEASE', qty, 'Reservation released manually back to inventory ledger.', 'RES-REL');
    toast.success(`${qty} units released from reserve.`);
  };

  if (!item) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-400">
        Locating stock item profile vectors...
      </div>
    );
  }

  // Filter historical movements matching this specific SKU and warehouse
  const itemMovements = stockMovements.filter(m => m.sku === item.sku && m.warehouseId === item.warehouseId);

  // Estimates cost/valuation
  const price = item.sku.endsWith('10000') ? 950 : item.sku.endsWith('10001') ? 12.5 : item.sku.endsWith('10002') ? 180 : item.sku.endsWith('10003') ? 450 : item.sku.endsWith('10004') ? 1200 : 100;
  const valuation = item.available * price;

  return (
    <div className="max-w-5xl mx-auto space-y-6" id="stock-details-root">
      
      {/* Header Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 w-9 h-9"
            onClick={() => router.push('/stock')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              {item.sku}
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight mt-1">
              {item.productName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReleaseReserve} className="text-slate-700 dark:text-zinc-300">
            Release Reservation
          </Button>
          <Button variant="danger" size="sm" onClick={handleReportDamage}>
            Report Loss / Damage
          </Button>
        </div>
      </div>

      {/* Main Stats Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Stock Inventory Vectors */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-5 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
            <Bookmark className="w-4 h-4 mr-1.5 text-slate-400" />
            Stock Ledger Vectors
          </h3>

          <div className="space-y-3 font-mono text-xs text-slate-600 dark:text-zinc-400">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
              <span className="font-sans font-bold text-slate-500">Available Units</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-zinc-100">{item.available}</span>
            </div>
            
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-850/40 border border-slate-100/50 dark:border-zinc-800/50">
              <span className="font-sans font-bold text-slate-500">Locked in Reserve</span>
              <span className="font-extrabold text-slate-700 dark:text-zinc-300">{item.reserved}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-850/40 border border-slate-100/50 dark:border-zinc-800/50">
              <span className="font-sans font-bold text-slate-500">Recorded Damage</span>
              <span className={`font-extrabold ${item.damaged > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{item.damaged}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-850/40 border border-slate-100/50 dark:border-zinc-800/50">
              <span className="font-sans font-bold text-slate-500">Inward Pending PO</span>
              <span className="font-extrabold text-blue-500">{item.incoming}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Location:</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">{item.warehouseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Category:</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">{item.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Brand Line:</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">{item.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Barcode:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{item.barcode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Asset Unit Price:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">₹{price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Asset Valuation:</span>
              <span className="font-mono font-extrabold text-slate-900 dark:text-zinc-50">₹{valuation.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Serialization & Batches */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Batches and Serials config */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-slate-400" />
              Serial Numbers & Batches
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Product Active Batch</span>
                <div className="text-xs font-mono">
                  {item.batchNumber ? (
                    <div className="space-y-1">
                      <div className="text-slate-800 dark:text-zinc-200 font-bold">Batch: {item.batchNumber}</div>
                      <div className="text-slate-500 font-semibold">Status: Active Batch Unit</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No batch number mapped to this SKU.</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Tracking Serials</span>
                <div className="text-xs font-mono">
                  {item.serialNumbers && item.serialNumbers.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.serialNumbers.map((sn, idx) => (
                        <span key={idx} className="bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 border border-slate-200/60 dark:border-zinc-700 rounded-md font-bold text-slate-700 dark:text-zinc-300">
                          {sn}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No tracking serials registered.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ledger audit history */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
              <History className="w-4 h-4 mr-1.5 text-slate-400" />
              Depot Stock Ledger Flow History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                    <th className="py-2">Date</th>
                    <th className="py-2">Flow Type</th>
                    <th className="py-2 text-right">Quantity</th>
                    <th className="py-2">Ref</th>
                    <th className="py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-800/50">
                  {itemMovements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-mono italic">
                        No historical stock transfers or inward logs exist for this node.
                      </td>
                    </tr>
                  ) : (
                    itemMovements.map((mov) => {
                      const isPositive = mov.quantity > 0;
                      return (
                        <tr key={mov.id}>
                          <td className="py-3 font-mono text-[10px] text-slate-400">
                            {new Date(mov.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <Badge variant={
                              mov.type === 'STOCK_IN' ? 'success' :
                              mov.type === 'STOCK_OUT' ? 'error' :
                              mov.type === 'TRANSFER' ? 'info' :
                              mov.type === 'ADJUSTMENT' ? 'warning' : 'neutral'
                            }>
                              {mov.type}
                            </Badge>
                          </td>
                          <td className={`py-3 text-right font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? `+${mov.quantity}` : mov.quantity}
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-700 dark:text-zinc-300">
                            {mov.reference || 'Manual'}
                          </td>
                          <td className="py-3 text-slate-500 italic max-w-[200px] truncate" title={mov.notes}>
                            {mov.notes}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function StockDetailsPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <StockDetailsContent />
      </AdminLayout>
    </AppProviders>
  );
}
