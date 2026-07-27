'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button } from '@/components/enterprise/BaseInputs';
import { Badge } from '@/components/enterprise/BaseInputs';
import { motion } from 'motion/react';
import { 
  Warehouse, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Receipt, 
  Users, 
  RefreshCw, 
  Search, 
  Filter,
  Calendar,
  Layers,
  ChevronRight,
  Printer
} from 'lucide-react';

function DashboardContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { 
    warehouses, 
    stock, 
    stockMovements, 
    purchaseOrders, 
    suppliers,
    stockTransfers
  } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [movementFilter, setMovementFilter] = React.useState<'ALL' | 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT'>('ALL');
  const [selectedMovement, setSelectedMovement] = React.useState<any | null>(null);

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Dashboard' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Calculations
  const totalWarehouses = warehouses.length;
  const activeSkusCount = Array.from(new Set(stock.map(s => s.sku))).length;
  
  // Total units available
  const totalStockUnits = stock.reduce((acc, curr) => acc + curr.available, 0);
  
  // Low Stock Items (Available < 20)
  const lowStockItems = stock.filter(item => item.available < 20);
  const lowStockCount = lowStockItems.length;

  // Total valuation
  // We'll estimate price: AeroFlow Turbine = 950, Spark Plug = 12.5, Fluid = 180, Strut = 450, Battery = 1200
  const getEstimatedPrice = (sku: string) => {
    if (sku.endsWith('10000')) return 950.0;
    if (sku.endsWith('10001')) return 12.5;
    if (sku.endsWith('10002')) return 180.0;
    if (sku.endsWith('10003')) return 450.0;
    if (sku.endsWith('10004')) return 1200.0;
    return 100.0;
  };

  const totalValuation = stock.reduce((sum, item) => {
    const price = getEstimatedPrice(item.sku);
    return sum + (item.available * price);
  }, 0);

  // Active Purchase Orders (Approved or Pending Approval)
  const activePOs = purchaseOrders.filter(po => po.status === 'APPROVED' || po.status === 'PENDING_APPROVAL');
  
  // Active transfers
  const activeTransfers = stockTransfers.filter(t => t.status === 'PENDING' || t.status === 'IN_TRANSIT');

  // Warehouse specific valuations
  const warehouseValuations = warehouses.map(wh => {
    const whStock = stock.filter(s => s.warehouseId === wh.id);
    const valuation = whStock.reduce((sum, item) => sum + (item.available * getEstimatedPrice(item.sku)), 0);
    const itemsCount = whStock.reduce((sum, item) => sum + item.available, 0);
    return {
      name: wh.name,
      code: wh.code,
      valuation,
      itemsCount
    };
  });

  // Filtered Stock Movements
  const filteredMovements = stockMovements.filter(m => {
    const matchesSearch = m.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (movementFilter === 'ALL') return matchesSearch;
    return m.type === movementFilter && matchesSearch;
  });

  return (
    <div className="space-y-6" id="inventory-dashboard-root">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 rounded-2xl text-white shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <Warehouse className="w-96 h-96 text-slate-100" />
        </div>
        <div className="space-y-1 z-10">
          <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Enterprise Logistics Control Center
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide max-w-2xl">
            Real-time multisite inventory consolidation, active supply line verification, and warehouse stock flow diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2 z-10">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-700 hover:bg-slate-850 text-slate-200"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Ledger
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => window.location.href = '/stock'}
            className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          >
            Manage Stock Control
          </Button>
        </div>
      </div>

      {/* 2. Consolidated High-Density Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Valuation */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/60 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-mono">Consolidated Valuation</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 font-mono">
              ₹{totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +8.4% Valuation Margin YoY
            </p>
          </div>
        </motion.div>

        {/* Low Stock Watch */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/60 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-mono">Quarantine & Low Stock</span>
            <div className={`p-2 rounded-lg ${lowStockCount > 0 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 font-mono">
              {lowStockCount} SKUs
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1">
              {lowStockCount > 0 ? `${lowStockCount} items below safety trigger limit` : 'All physical stock thresholds healthy'}
            </p>
          </div>
        </motion.div>

        {/* Total Physical Units */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/60 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-mono">Total Unit Assets</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 font-mono">
              {totalStockUnits.toLocaleString()} Units
            </h3>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Across {activeSkusCount} Active Catalog SKUs
            </p>
          </div>
        </motion.div>

        {/* Inward Line Status */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/60 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-mono">Active Inflow Pipeline</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 font-mono">
              {activePOs.length} POs Pending
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
              With {activeTransfers.length} Active Inter-Site Transfers
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. BENTO SECTION: Warehouse Allocations & Fast Stock Auditing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Warehouse Valuations & Capacities */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200/60 dark:border-zinc-800/80 shadow-xs lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-150 uppercase tracking-wider font-mono flex items-center">
                <Layers className="w-4 h-4 mr-2 text-slate-500" />
                Warehouse Allocation
              </h3>
              <Badge variant="neutral">{totalWarehouses} Sites</Badge>
            </div>
            
            <p className="text-xs text-slate-500 mb-6">
              Asset split and unit density indicators per registered physical depot.
            </p>

            <div className="space-y-4">
              {warehouseValuations.map((whVal, i) => {
                // capacity ratio
                const percentage = Math.min(100, Math.round((whVal.itemsCount / 12000) * 100));
                return (
                  <div key={i} className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-zinc-850/50 border border-slate-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">{whVal.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{whVal.code}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-50 font-mono">
                        ₹{whVal.valuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">{whVal.itemsCount.toLocaleString()} units</span>
                        <span className="text-slate-400 font-semibold">{percentage}% storage fill</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-slate-800 dark:bg-brand h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between">
            <span className="text-xs text-slate-500">Registered Suppliers:</span>
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-zinc-200">{suppliers.length} Partners</span>
          </div>
        </div>

        {/* Real-time Ledger of Stock Movements */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200/60 dark:border-zinc-800/80 shadow-xs lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-150 uppercase tracking-wider font-mono flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 text-slate-500 animate-spin-slow" />
                Live Stock Movement Log
              </h3>
              <p className="text-xs text-slate-500 mt-1">Audit trail of inward receive, damage, loss, manual adjustments and transfers.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={movementFilter} 
                onChange={(e: any) => setMovementFilter(e.target.value)}
                className="p-1.5 text-xs font-semibold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
              >
                <option value="ALL">All Flows</option>
                <option value="STOCK_IN">Inward (Stock In)</option>
                <option value="STOCK_OUT">Outward (Stock Out)</option>
                <option value="TRANSFER">Transfers</option>
                <option value="ADJUSTMENT">Adjustments</option>
              </select>
            </div>
          </div>

          {/* Search bar inside the card */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search movements by SKU, product, or reference PO..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100/50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg outline-hidden focus:ring-1 focus:ring-slate-500 text-slate-700 dark:text-zinc-200 transition-all"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Flow Type</th>
                  <th className="py-2.5 px-3">Item Details</th>
                  <th className="py-2.5 px-3">Warehouse</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/50 text-xs">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono text-xs">
                      No stock movements found matching filter criteria. Go to PO or GRN to initiate inflow.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.slice(0, 7).map((mov) => {
                    const isPositive = mov.quantity > 0;
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/40 transition-colors">
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                          {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={
                            mov.type === 'STOCK_IN' ? 'success' :
                            mov.type === 'STOCK_OUT' ? 'error' :
                            mov.type === 'TRANSFER' ? 'info' :
                            mov.type === 'ADJUSTMENT' ? 'warning' : 'neutral'
                          }>
                            {mov.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 max-w-[150px] truncate">
                          <div className="font-bold text-slate-800 dark:text-zinc-200">{mov.productName}</div>
                          <span className="text-[10px] font-mono text-slate-400">{mov.sku}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                          {mov.warehouseName.split(' ')[0]}
                        </td>
                        <td className={`py-3 px-3 text-right font-bold font-mono ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                          {isPositive ? `+${mov.quantity}` : mov.quantity}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-[10px] text-slate-700 dark:text-zinc-300">
                          {mov.reference || 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button 
                            onClick={() => setSelectedMovement(mov)}
                            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:underline flex items-center justify-end"
                          >
                            Details
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </button>
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

      {/* 4. Movement Details Drawer/Modal (Controlled locally in state) */}
      {selectedMovement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-950 dark:text-zinc-100">
                Movement Audit Slip
              </h4>
              <button 
                onClick={() => setSelectedMovement(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Product SKU</span>
                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{selectedMovement.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Name</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200 text-right">{selectedMovement.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Activity Event</span>
                <Badge variant={selectedMovement.quantity > 0 ? 'success' : 'error'}>
                  {selectedMovement.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Location</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">{selectedMovement.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Ledger Delta</span>
                <span className={`font-mono font-bold ${selectedMovement.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedMovement.quantity > 0 ? `+${selectedMovement.quantity}` : selectedMovement.quantity} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Dispatched Ref</span>
                <span className="font-mono font-bold text-slate-700 dark:text-zinc-300">{selectedMovement.reference || 'None (Manual Adjustment)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Timestamp</span>
                <span className="font-mono text-slate-500">{new Date(selectedMovement.timestamp).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Log Description & Remarks</span>
                <p className="text-slate-600 dark:text-zinc-300 italic">{selectedMovement.notes || 'No remarks recorded for this transaction.'}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedMovement(null)}>
                Close Audit Slip
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function InventoryDashboardPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </AppProviders>
  );
}
