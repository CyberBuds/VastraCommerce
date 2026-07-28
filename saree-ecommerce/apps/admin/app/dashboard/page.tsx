'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useLayoutStore } from '@/store/layoutStore';
import { useSettingsStore } from '@/store/settingsStore';
import { usePermission } from '@/hooks/usePermission';
import { useDialog } from '@/hooks/useDialog';
import { Card, Alert, Dialog } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { Select } from '@/components/enterprise/InteractiveComponents';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  ShoppingBag,
  Warehouse,
  Play,
  Activity,
  Plus,
  Sliders,
  AlertTriangle,
  History,
} from 'lucide-react';
import { formatDate, formatCurrency, formatNumber } from '@/utils/format';
import { toast } from 'sonner';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { settings, updateSettings } = useSettingsStore();
  const { hasPermission } = usePermission();

  // Dialogs
  const addProductDialog = useDialog();
  const latencyDialog = useDialog();

  // Set active breadcrumbs on mount
  React.useEffect(() => {
    setActiveMenuId('dashboard');
    setBreadcrumbs([{ label: 'Dashboard', href: '/dashboard' }]);
  }, [setBreadcrumbs, setActiveMenuId]);

  // Query stats and activities
  const { data: dashData, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/stats');
      return res.data.data;
    },
  });

  // Mutation to add new product
  const addProductMutation = useMutation({
    mutationFn: async (newProd: any) => {
      const res = await api.post('/api/catalog/products', newProd);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Product created successfully', {
        description: 'New product added to catalog registry.',
      });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      addProductDialog.close();
    },
  });

  const handleAddProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const product = {
      name: fd.get('name') as string,
      sku: fd.get('sku') as string,
      category: fd.get('category') as string,
      price: parseFloat(fd.get('price') as string),
      stock: parseInt(fd.get('stock') as string),
      status: fd.get('status') as string,
    };

    if (!product.name || !product.sku || isNaN(product.price) || isNaN(product.stock)) {
      toast.error('Validation Error', { description: 'Please fill out all required fields correctly.' });
      return;
    }

    addProductMutation.mutate(product);
  };

  const handleLatencySave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const latency = parseInt(fd.get('latency') as string);
    if (!isNaN(latency)) {
      updateSettings({ simulatedLatencyMs: latency });
      toast.success('Simulation Settings Synchronized', {
        description: `Server-side artificial latency set to ${latency}ms.`,
      });
      latencyDialog.close();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-zinc-800 animate-pulse w-48 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-zinc-850 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = dashData?.stats;
  const recentOrders = dashData?.recentOrders || [];
  const recentActivities = dashData?.recentActivities || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Enterprise Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Operational and transaction telemetry logs
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()} icon={History}>
            Sync Metrics
          </Button>
        </div>
      </div>

      {settings.isMaintenanceMode && (
        <Alert
          type="warning"
          title="EMERGENCY MAINTENANCE CONTROLS ACTIVE"
          description="A system-wide maintenance mode has been triggered. Database write queries are throttled."
          onClose={() => updateSettings({ isMaintenanceMode: false })}
        />
      )}

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Revenue Card */}
        <Card className="hover:translate-y-[-2px] transition-transform">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-250 border border-slate-100 dark:border-zinc-750">
              <DollarSign className="w-5 h-5" />
            </span>
            <div className={`flex items-center text-xs font-bold gap-0.5 ${stats?.revenue.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {stats?.revenue.change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(stats?.revenue.change)}%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xs text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Gross Revenue</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              {formatCurrency(stats?.revenue.value)}
            </p>
          </div>
        </Card>

        {/* Orders Card */}
        <Card className="hover:translate-y-[-2px] transition-transform">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-250 border border-slate-100 dark:border-zinc-750">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <div className={`flex items-center text-xs font-bold gap-0.5 ${stats?.orders.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {stats?.orders.change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(stats?.orders.change)}%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xs text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Processed Orders</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              {formatNumber(stats?.orders.value)}
            </p>
          </div>
        </Card>

        {/* Customers Card */}
        <Card className="hover:translate-y-[-2px] transition-transform">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-250 border border-slate-100 dark:border-zinc-750">
              <Users className="w-5 h-5" />
            </span>
            <div className={`flex items-center text-xs font-bold gap-0.5 ${stats?.customers.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {stats?.customers.change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(stats?.customers.change)}%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xs text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Active Customers</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              {formatNumber(stats?.customers.value)}
            </p>
          </div>
        </Card>

        {/* Catalog Products Card */}
        <Card className="hover:translate-y-[-2px] transition-transform">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-250 border border-slate-100 dark:border-zinc-750">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <Badge variant="purple">Active</Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-xs text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Catalog SKUs</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              {stats?.products.value}
            </p>
          </div>
        </Card>

        {/* Inventory Stock Card */}
        <Card className="hover:translate-y-[-2px] transition-transform">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-250 border border-slate-100 dark:border-zinc-750">
              <Warehouse className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {stats?.inventory.lowStock} Low Stock
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Inventory</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              {formatNumber(stats?.inventory.value)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders List Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4.5 h-4.5 text-slate-750" />
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">Critical Pending Shipments</span>
                </div>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-850 pb-2.5 text-slate-450 font-bold uppercase tracking-wide">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Customer Account</th>
                    <th className="pb-3 pr-4">Created Date</th>
                    <th className="pb-3 pr-4 text-right">Sum Total</th>
                    <th className="pb-3 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-zinc-850">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-zinc-150">{ord.id}</td>
                      <td className="py-3.5 pr-4 text-slate-650 dark:text-zinc-350">{ord.customer}</td>
                      <td className="py-3.5 pr-4 text-slate-500 dark:text-zinc-450 font-medium">{formatDate(ord.date, 'short')}</td>
                      <td className="py-3.5 pr-4 text-right font-extrabold text-slate-900 dark:text-zinc-100">{formatCurrency(ord.amount)}</td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold leading-4 ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                              : ord.status === 'PROCESSING'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 animate-pulse'
                              : ord.status === 'SHIPPED'
                              ? 'bg-blue-50 text-blue-750 dark:bg-blue-950/20 dark:text-blue-400'
                              : 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar panels (Quick actions and activities) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick actions panel */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-slate-750" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">Quick Terminal Actions</span>
              </div>
            }
          >
            <div className="flex flex-col gap-2.5">
              {hasPermission('manage:catalog') && (
                <Button
                  variant="primary"
                  className="w-full py-2.5 font-bold text-xs"
                  onClick={() => addProductDialog.open()}
                  icon={Plus}
                >
                  Create Product SKU
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full py-2.5 font-bold text-xs text-left justify-start"
                onClick={() => latencyDialog.open()}
                icon={Sliders}
              >
                Modify API Latency ({settings.simulatedLatencyMs}ms)
              </Button>
              <Button
                variant="outline"
                className="w-full py-2.5 font-bold text-xs text-left justify-start border-red-200 text-red-650 hover:bg-red-50 dark:border-red-950 dark:text-red-450 dark:hover:bg-red-950/20"
                onClick={() => {
                  updateSettings({ isMaintenanceMode: !settings.isMaintenanceMode });
                  toast.warning('Maintenance Config Update', {
                    description: `Maintenance mode is now ${!settings.isMaintenanceMode ? 'ENABLED' : 'DISABLED'}`,
                  });
                }}
                icon={AlertTriangle}
              >
                Toggle Maintenance Mode
              </Button>
            </div>
          </Card>

          {/* Recent Operations Activity logs */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-slate-750" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">Operational Activity Log</span>
              </div>
            }
          >
            <div className="flex flex-col gap-4">
              {recentActivities.map((act: any) => (
                <div key={act.id} className="flex gap-3 items-start text-xs border-b border-slate-50 last:border-none pb-3 last:pb-0">
                  <img
                    src={act.user.avatarUrl}
                    alt={act.user.name}
                    className="w-8 h-8 rounded-full border border-slate-100 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-zinc-200 leading-tight">
                      <span className="font-bold">{act.user.name}</span> {act.action}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 mt-0.5 truncate">
                      {act.target}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 mt-1">
                      {formatDate(act.timestamp, 'relative')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 1. Add Product SKU Modal */}
      <Dialog isOpen={addProductDialog.isOpen} onClose={addProductDialog.close} title="Create Catalog Product SKU">
        <form onSubmit={handleAddProductSubmit} className="space-y-4">
          <Input label="Product Name" name="name" required placeholder="AeroFlow Turbine X5" />
          <Input label="Catalog SKU Code" name="sku" required placeholder="SKU-AERO-99100" />
          <Select
            label="Product Category"
            name="category"
            options={[
              { value: 'Turbines', label: 'Turbines' },
              { value: 'Auto Components', label: 'Auto Components' },
              { value: 'Fluids', label: 'Fluids' },
              { value: 'Structural', label: 'Structural' },
              { value: 'Electrical', label: 'Electrical' },
              { value: 'Instruments', label: 'Instruments' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (USD)" name="price" type="number" step="0.01" required placeholder="1499.99" />
            <Input label="Stock Levels" name="stock" type="number" required placeholder="120" />
          </div>
          <Select
            label="Fulfillment Status"
            name="status"
            options={[
              { value: 'ACTIVE', label: 'Active / Stocked' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
            ]}
          />
          <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={addProductDialog.close}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Product SKU
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 2. Latency Modifier Modal */}
      <Dialog isOpen={latencyDialog.isOpen} onClose={latencyDialog.close} title="Simulated Network Latency">
        <form onSubmit={handleLatencySave} className="space-y-4">
          <Input
            label="Simulated Latency (milliseconds)"
            name="latency"
            type="number"
            defaultValue={settings.simulatedLatencyMs}
            required
            placeholder="300"
            helperText="Simulate real-world API call delay behavior in the browser."
          />
          <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={latencyDialog.close}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Apply Latency
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
