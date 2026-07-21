'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Input } from '@/components/enterprise/BaseInputs';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Building2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

function NewWarehouseContent() {
  const router = useRouter();
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { addWarehouse } = useInventoryStore();

  // Controlled states for validation and SOLID architecture
  const [formData, setFormData] = React.useState({
    code: '',
    name: '',
    manager: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    address: '',
    capacity: 5000,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    isDefault: false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Warehouses', href: '/warehouses' },
      { label: 'Register New Site' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'capacity') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.code.trim()) nextErrors.code = 'Warehouse code is required';
    else if (!/^WH-[A-Z0-9]{3,6}-\d+$/.test(formData.code)) {
      nextErrors.code = 'Format must be like WH-CHE-04 (capital letters, digits)';
    }

    if (!formData.name.trim()) nextErrors.name = 'Warehouse name is required';
    if (!formData.manager.trim()) nextErrors.manager = 'Manager name is required';
    if (!formData.email.trim()) nextErrors.email = 'Contact email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Invalid email address';
    
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!formData.city.trim()) nextErrors.city = 'City is required';
    if (!formData.state.trim()) nextErrors.state = 'State is required';
    if (!formData.address.trim()) nextErrors.address = 'Detailed address is required';
    
    if (formData.capacity <= 0) nextErrors.capacity = 'Capacity must be greater than 0';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Validation failed. Please inspect the red-marked fields.');
      return;
    }

    addWarehouse(formData);
    toast.success(`Warehouse "${formData.name}" has been registered successfully.`);
    router.push('/warehouses');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="new-warehouse-root">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="p-2 w-9 h-9"
          onClick={() => router.push('/warehouses')}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-slate-500" />
            Register Site Depot
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Deploy a new multisite unit to handle physical stock intake, binting and audits.
          </p>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
        
        {/* Core Code & Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Warehouse Code</label>
            <input 
              name="code"
              placeholder="e.g. WH-CHE-04"
              value={formData.code}
              onChange={handleChange}
              className={`w-full text-xs font-mono font-bold uppercase p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.code ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.code ? (
              <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.code}</p>
            ) : (
              <p className="text-[10px] text-slate-400 font-mono">Syntax: WH-[CODE]-[NUM]</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Warehouse Name</label>
            <input 
              name="name"
              placeholder="e.g. Chennai Sea Port Depot"
              value={formData.name}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.name ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.name}</p>}
          </div>
        </div>

        {/* Capacity & Default Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Capacity Limits (Units)</label>
            <input 
              type="number"
              name="capacity"
              placeholder="e.g. 5000"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full text-xs font-bold font-mono p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.capacity ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.capacity && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.capacity}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Status State</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex items-center h-full pt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 border-slate-300 dark:border-zinc-700 text-brand focus:ring-brand accent-brand rounded-sm"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-700 dark:text-zinc-200 block">Mark as Default Depot</span>
                <span className="text-[10px] text-slate-400">Auto-routes newly created purchase orders</span>
              </div>
            </label>
          </div>
        </div>

        {/* Manager & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Depot Manager Name</label>
            <input 
              name="manager"
              placeholder="e.g. Ramesh Kumar"
              value={formData.manager}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.manager ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.manager && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.manager}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Contact Person (For Shipments)</label>
            <input 
              name="contactPerson"
              placeholder="e.g. Anjali Sharma"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Manager Email</label>
            <input 
              type="email"
              name="email"
              placeholder="manager.wh@aero.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.email ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.email && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Manager Contact Phone</label>
            <input 
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.phone ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.phone && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.phone}</p>}
          </div>
        </div>

        {/* Address & Geographic splits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">City</label>
            <input 
              name="city"
              placeholder="e.g. Chennai"
              value={formData.city}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.city ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.city && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.city}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">State</label>
            <input 
              name="state"
              placeholder="e.g. Tamil Nadu"
              value={formData.state}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.state ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.state && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.state}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Country</label>
            <input 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Detailed Physical Address</label>
            <input 
              name="address"
              placeholder="e.g. Plot 11, Harbour Road Terminal, Chennai Port, India"
              value={formData.address}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.address && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.address}</p>}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-mono">
            * Complete all physical registration parameters to register site.
          </p>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/warehouses')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              size="sm"
              className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Configuration
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default function NewWarehousePage() {
  return (
    <AppProviders>
      <AdminLayout>
        <NewWarehouseContent />
      </AdminLayout>
    </AppProviders>
  );
}
