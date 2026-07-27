'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, CycleCount, CycleCountItem } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { 
  Plus, 
  RotateCcw, 
  Check, 
  X, 
  ClipboardCheck, 
  History, 
  AlertTriangle,
  Scale,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

function CycleCountsContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { cycleCounts, warehouses, stock, addCycleCount, completeCycleCount } = useInventoryStore();

  const [activeSession, setActiveSession] = React.useState<CycleCount | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState('');
  const [sessionNotes, setSessionNotes] = React.useState('');

  // Count inputs mapping SKU -> actual counted qty
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Cycle Counts (Audits)' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  React.useEffect(() => {
    if (warehouses.length > 0 && !selectedWarehouseId) {
      const defaultWh = warehouses[0].id;
      Promise.resolve().then(() => {
        setSelectedWarehouseId(prev => prev || defaultWh);
      });
    }
  }, [warehouses, selectedWarehouseId]);

  const handleStartSession = () => {
    if (!selectedWarehouseId) {
      toast.error('Please select a target Warehouse site.');
      return;
    }

    const whObj = warehouses.find(w => w.id === selectedWarehouseId);
    if (!whObj) return;

    // Filter items in that warehouse
    const itemsInWh = stock.filter(s => s.warehouseId === selectedWarehouseId);
    if (itemsInWh.length === 0) {
      toast.error('The selected warehouse has no stock items configured yet. Add stock first.');
      return;
    }

    const initialItems: CycleCountItem[] = itemsInWh.map(item => ({
      sku: item.sku,
      productName: item.productName,
      systemQty: item.available,
      countedQty: item.available, // Default to system level
    }));

    // Seed inputs state
    const initialCounts: Record<string, number> = {};
    itemsInWh.forEach(item => {
      initialCounts[item.sku] = item.available;
    });
    setCounts(initialCounts);

    const newSession: CycleCount = {
      id: `CC-${Date.now().toString().slice(-4)}`,
      countNumber: `AUD-2026-${Date.now().toString().slice(-4)}`,
      warehouseId: selectedWarehouseId,
      warehouseName: whObj.name,
      status: 'PENDING',
      items: initialItems,
      notes: sessionNotes || 'Standard Physical Verification',
      createdAt: new Date().toISOString(),
    };

    setActiveSession(newSession);
    toast.success(`Active Audit Worksheet created for ${whObj.name}.`);
  };

  const handleCountChange = (sku: string, val: number) => {
    setCounts(prev => ({ ...prev, [sku]: Math.max(0, val) }));
  };

  const handleCompleteSession = () => {
    if (!activeSession) return;

    const auditedItems: CycleCountItem[] = activeSession.items.map(item => ({
      ...item,
      countedQty: counts[item.sku] ?? (item.systemQty ?? 0),
    }));

    // Calculate accuracy %
    let matchCount = 0;
    auditedItems.forEach(item => {
      if ((item.systemQty ?? 0) === item.countedQty) {
        matchCount++;
      }
    });
    const accuracy = parseFloat(((matchCount / auditedItems.length) * 100).toFixed(1));

    completeCycleCount(activeSession.id, auditedItems, accuracy, 'Yash Gupta (Audit Officer)');
    
    toast.success(`Audit Session ${activeSession.countNumber} completed with ${accuracy}% accuracy! Discrepancies auto-adjusted.`);
    setActiveSession(null);
    setSessionNotes('');
  };

  return (
    <div className="space-y-6" id="cycle-counts-root">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Cycle Counts & Physical Audits
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Execute physical verification schedules. Auditing stock reconciles system balances with floor counts, auto-generating discrepancy logs.
        </p>
      </div>

      {!activeSession ? (
        /* Setup / History layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Start audit form */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-1.5" />
              Schedule Physical Verification
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Audit Site Warehouse</label>
                <select 
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Audit Notes / Scope</label>
                <textarea 
                  placeholder="e.g. Monthly electronics high-value zone sweep, random audit cycle #4..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden min-h-[70px]"
                />
              </div>

              <Button 
                onClick={handleStartSession}
                variant="primary" 
                className="w-full py-2.5 text-xs font-bold dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Start Physical Count
              </Button>
            </div>
          </div>

          {/* Audit History ledger */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450 flex items-center">
              <History className="w-4 h-4 mr-1.5" />
              Historical Audit Schedules Archive
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono">
                    <th className="py-2.5 px-3">Audit Code</th>
                    <th className="py-2.5 px-3">Warehouse Site</th>
                    <th className="py-2.5 px-3">Audited Items</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Notes Remarks</th>
                    <th className="py-2.5 px-3">Audit Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/60">
                  {cycleCounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-450 font-mono">
                        No previous audit history discovered. Launch a new physical verification above.
                      </td>
                    </tr>
                  ) : (
                    cycleCounts.map((cc) => (
                      <tr key={cc.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20">
                        <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-400">
                          {cc.countNumber}
                        </td>
                        <td className="py-3 px-3 font-extrabold text-slate-850 dark:text-zinc-200">
                          {cc.warehouseName}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-zinc-350">
                          {cc.items.length} SKUs counted
                        </td>
                        <td className="py-3 px-3">
                          {cc.accuracyScore !== undefined ? (
                            <div className="flex items-center gap-1.5">
                              <Badge variant={cc.accuracyScore > 95 ? 'success' : 'warning'}>
                                {cc.accuracyScore}% Accuracy
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="warning">In Progress</Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 italic max-w-[120px] truncate" title={cc.notes}>
                          {cc.notes}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-zinc-300">
                          {cc.approvedBy || 'Pending Completion'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* Counting session worksheet */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-150 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-150 flex items-center">
                <Scale className="w-5 h-5 mr-1.5 text-slate-500" />
                Physical Audit Sheet: {activeSession.countNumber}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Location Node: {activeSession.warehouseName}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveSession(null)}>
                Abort Audit
              </Button>
              <Button 
                onClick={handleCompleteSession}
                variant="primary" 
                size="sm"
                className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              >
                Complete & Adjust Discrepancies
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-850 text-[10px] font-mono font-bold uppercase border-b border-slate-150 dark:border-zinc-800 text-slate-400">
                  <th className="py-3 px-4">Item SKU Details</th>
                  <th className="py-3 px-4 text-center">System Registered Count</th>
                  <th className="py-3 px-4 text-center">Physical Counted Count</th>
                  <th className="py-3 px-4 text-right">Discrepancy Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-zinc-800/60">
                {activeSession.items.map((it) => {
                  const currentCountVal = counts[it.sku] ?? (it.systemQty ?? 0);
                  const variance = currentCountVal - (it.systemQty ?? 0);

                  return (
                    <tr key={it.sku} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20">
                      <td className="py-3 px-4">
                        <span className="font-sans font-bold text-slate-800 dark:text-zinc-200 block">{it.productName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{it.sku}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono text-slate-500">
                        {it.systemQty ?? 0} units
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <input 
                            type="number"
                            value={currentCountVal}
                            onChange={(e) => handleCountChange(it.sku, parseInt(e.target.value) || 0)}
                            className="w-24 text-center text-xs font-extrabold font-mono p-1 border border-slate-250 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono">
                        {variance === 0 ? (
                          <span className="text-emerald-600 font-bold flex items-center justify-end">
                            <Sparkles className="w-3.5 h-3.5 mr-1" />
                            0 Discrepancy
                          </span>
                        ) : variance > 0 ? (
                          <span className="text-blue-500">+{variance} Surplus</span>
                        ) : (
                          <span className="text-rose-500">{variance} Shortage</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CycleCountsPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <CycleCountsContent />
      </AdminLayout>
    </AppProviders>
  );
}
