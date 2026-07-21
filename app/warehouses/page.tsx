'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, Warehouse } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldAlert, 
  Edit, 
  Trash2, 
  Check, 
  CheckCircle, 
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

function WarehousesContent() {
  const router = useRouter();
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { warehouses, updateWarehouse, deleteWarehouse, stock } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Warehouses' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  const handleSetDefault = (id: string, name: string) => {
    updateWarehouse(id, { isDefault: true });
    toast.success(`"${name}" is now marked as the Default Warehouse for new shipments.`);
  };

  const handleDelete = (id: string, name: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('The Default Warehouse cannot be deleted. Assign another warehouse as default first.');
      return;
    }
    
    // Check if warehouse has stock items
    const whStock = stock.filter(s => s.warehouseId === id && s.available > 0);
    if (whStock.length > 0) {
      toast.error(`"${name}" cannot be deleted because it still contains active product inventory.`);
      return;
    }

    if (confirm(`Are you sure you want to delete warehouse "${name}"? This action is irreversible.`)) {
      deleteWarehouse(id);
      toast.success(`Warehouse "${name}" was successfully decommissioned.`);
    }
  };

  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = wh.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wh.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wh.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wh.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return wh.status === statusFilter && matchesSearch;
  });

  return (
    <div className="space-y-6" id="warehouses-list-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Warehouses & Sites
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Configure multi-site storage depots, physical shelf capacities, local hub managers, and default distribution endpoints.
          </p>
        </div>
        <div>
          <Link href="/warehouses/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Register Warehouse
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Control bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search warehouses by name, hub code, manager, or city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg outline-hidden focus:ring-1 focus:ring-slate-500 text-slate-700 dark:text-zinc-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md outline-hidden text-slate-700 dark:text-zinc-300"
          >
            <option value="ALL">All States</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Decommissioned</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWarehouses.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 p-12 text-center rounded-xl">
            <Layers className="w-12 h-12 mx-auto text-slate-350 animate-pulse mb-3" />
            <p className="text-sm font-mono font-bold text-slate-500 dark:text-zinc-400">No sites found matching queries.</p>
            <p className="text-xs text-slate-400 mt-1">Add a new site to partition and scale product stock levels across locations.</p>
          </div>
        ) : (
          filteredWarehouses.map((wh) => {
            // Calculate real stock counts in this warehouse
            const whStock = stock.filter(s => s.warehouseId === wh.id);
            const totalUnits = whStock.reduce((acc, curr) => acc + curr.available, 0);
            const lowStockInWh = whStock.filter(s => s.available < 20).length;
            const capacityUtilization = Math.min(100, Math.round((totalUnits / wh.capacity) * 100));

            return (
              <motion.div 
                key={wh.id}
                whileHover={{ y: -3 }}
                className={`bg-white dark:bg-zinc-900 border ${wh.isDefault ? 'border-slate-800 dark:border-brand shadow-md' : 'border-slate-200/60 dark:border-zinc-800/80'} rounded-xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden`}
              >
                {wh.isDefault && (
                  <div className="absolute right-0 top-0 bg-slate-800 dark:bg-brand text-white dark:text-zinc-900 text-[10px] font-bold font-mono py-1 px-3.5 rounded-bl-lg flex items-center shadow-xs">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    DEFAULT GATEWAY
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title & Code */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md uppercase">
                      {wh.code}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-1.5 flex items-center">
                      {wh.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                      {wh.address}, {wh.city}
                    </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Current Stock</span>
                      <span className="font-extrabold text-slate-800 dark:text-zinc-200 text-sm">
                        {totalUnits.toLocaleString()} units
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Max Threshold</span>
                      <span className="font-bold text-slate-600 dark:text-zinc-300">
                        {wh.capacity.toLocaleString()} units
                      </span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold">
                      <span className="text-slate-400">Hub Storage Utilization</span>
                      <span className={capacityUtilization > 90 ? 'text-rose-600' : 'text-slate-500'}>
                        {capacityUtilization}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          capacityUtilization > 90 ? 'bg-rose-600' :
                          capacityUtilization > 75 ? 'bg-amber-500' :
                          'bg-slate-800 dark:bg-brand'
                        }`}
                        style={{ width: `${capacityUtilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Manager Contacts */}
                  <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Manager:</span>
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{wh.manager}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {wh.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {wh.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-4 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={wh.status === 'ACTIVE' ? 'success' : 'error'}>
                      {wh.status}
                    </Badge>
                    {wh.status === 'ACTIVE' && !wh.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(wh.id, wh.name)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 flex items-center gap-0.5 py-0.5 px-2 bg-slate-100 dark:bg-zinc-800 rounded-md transition-all border border-slate-200/50 dark:border-zinc-700"
                        title="Set as system default warehouse"
                      >
                        <Check className="w-3 h-3" />
                        Set Default
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Link href={`/warehouses/edit/${wh.id}`}>
                      <button 
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-md transition-all border border-transparent hover:border-slate-200/60"
                        title="Edit config parameters"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(wh.id, wh.name, wh.isDefault)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-all"
                      title="Decommission warehouse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function WarehousesPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <WarehousesContent />
      </AdminLayout>
    </AppProviders>
  );
}
