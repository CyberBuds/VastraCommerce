'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, Warehouse } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button } from '@/components/enterprise/BaseInputs';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function EditWarehouseContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { warehouses, updateWarehouse } = useInventoryStore();

  const [formData, setFormData] = React.useState<Warehouse | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Fetch warehouse data on mount
  React.useEffect(() => {
    if (id) {
      const match = warehouses.find(w => w.id === id);
      if (match) {
        Promise.resolve().then(() => {
          setFormData(prev => prev || match);
        });
      } else {
        toast.error('Warehouse site not found.');
        router.push('/warehouses');
      }
    }
  }, [id, warehouses, router]);

  React.useEffect(() => {
    if (formData) {
      setBreadcrumbs([
        { label: 'Inventory', href: '/inventory/dashboard' },
        { label: 'Warehouses', href: '/warehouses' },
        { label: `Edit ${formData.name}` }
      ]);
      setActiveMenuId('inventory');
    }
  }, [formData, setBreadcrumbs, setActiveMenuId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => prev ? ({ ...prev, [name]: checked }) : null);
    } else if (name === 'capacity') {
      setFormData(prev => prev ? ({ ...prev, [name]: parseInt(value) || 0 }) : null);
    } else {
      setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    }
  };

  const validate = () => {
    if (!formData) return false;
    const nextErrors: Record<string, string> = {};
    if (!formData.code.trim()) nextErrors.code = 'Warehouse code is required';
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
    if (!formData) return;
    if (!validate()) {
      toast.error('Validation failed. Please inspect the red-marked fields.');
      return;
    }

    updateWarehouse(id, formData);
    toast.success(`Warehouse "${formData.name}" was successfully updated.`);
    router.push('/warehouses');
  };

  if (!formData) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-400">
        Locating Warehouse config file...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="edit-warehouse-root">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button 
          type="button"
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
            Edit Warehouse Configuration
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Modifying parameters for physical unit node: <span className="font-bold text-slate-600 dark:text-zinc-300">{formData.code}</span>
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
        
        {/* Core Code & Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Warehouse Code (Read-Only)</label>
            <input 
              name="code"
              value={formData.code}
              disabled
              className="w-full text-xs font-mono font-bold bg-slate-100 dark:bg-zinc-800/80 text-slate-500 p-2 border border-slate-200 dark:border-zinc-700 rounded-lg outline-hidden cursor-not-allowed"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Warehouse Name</label>
            <input 
              name="name"
              placeholder="e.g. Mumbai Port Depot"
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
              placeholder="e.g. 7500"
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
                disabled={formData.isDefault} // Cannot uncheck if it is the only default
                className="h-4 w-4 border-slate-300 dark:border-zinc-700 text-brand focus:ring-brand accent-brand rounded-sm disabled:opacity-50"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-700 dark:text-zinc-200 block">Default Gateway Hub</span>
                <span className="text-[10px] text-slate-400">
                  {formData.isDefault ? 'Must assign another default to clear' : 'Set as system default hub'}
                </span>
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
              placeholder="e.g. Milind Sawant"
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
              placeholder="e.g. Mumbai"
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
              placeholder="e.g. Maharashtra"
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
              placeholder="e.g. Shed 12B, JNPT Port Authority area, Mumbai, India"
              value={formData.address}
              onChange={handleChange}
              className={`w-full text-xs font-semibold p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-hidden ${errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-700'}`}
            />
            {errors.address && <p className="text-[10px] text-rose-500 font-bold font-mono">{errors.address}</p>}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
            <AlertCircle className="w-4 h-4 text-slate-350 shrink-0" />
            <span>Changing location coordinates impacts ongoing trans-shipments.</span>
          </div>
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

export default function EditWarehousePage() {
  return (
    <AppProviders>
      <AdminLayout>
        <EditWarehouseContent />
      </AdminLayout>
    </AppProviders>
  );
}
