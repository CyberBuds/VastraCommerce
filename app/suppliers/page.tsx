'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore, Supplier } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { 
  Plus, 
  Search, 
  Star, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  Building,
  CheckCircle,
  Inbox
} from 'lucide-react';
import { toast } from 'sonner';

function SuppliersContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { suppliers, addSupplier, deleteSupplier } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddingInline, setIsAddingInline] = React.useState(false);

  // Supplier Form State
  const [company, setCompany] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [category, setCategory] = React.useState('Electronics');
  const [rating, setRating] = React.useState<number>(5);

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Suppliers Directory' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please input complete supplier contact descriptors.');
      return;
    }

    addSupplier({
      company,
      contactName,
      email,
      phone,
      category,
      rating,
      status: 'ACTIVE',
    });

    toast.success(`Supplier "${company}" registered in procurement ledger.`);
    setCompany('');
    setContactName('');
    setEmail('');
    setPhone('');
    setIsAddingInline(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete supplier ${name}?`)) {
      deleteSupplier(id);
      toast.success(`Supplier "${name}" deleted from systems directory.`);
    }
  };

  const filteredSuppliers = suppliers.filter(s => {
    const contact = s.contactName || s.contactPerson || '';
    const cat = s.category || 'General';
    return s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6" id="suppliers-root">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Suppliers & Vendor Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage supply-chain relationships. Audit external manufacturer performance, contact registries, and category mappings.
          </p>
        </div>
        <div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsAddingInline(!isAddingInline)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {isAddingInline ? 'Close Form' : 'Register Supplier'}
          </Button>
        </div>
      </div>

      {/* Supplier registration form */}
      {isAddingInline && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450">
            Register New Vendor Contract
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Company Name</label>
              <input 
                placeholder="e.g. Acme Semiconductors"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Point of Contact</label>
              <input 
                placeholder="e.g. John Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Business Email</label>
              <input 
                type="email"
                placeholder="procurement@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Contact Phone</label>
              <input 
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Vendor Category Mapping</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                <option value="Electronics">Electronics</option>
                <option value="Raw Components">Raw Components</option>
                <option value="Packaging Materials">Packaging Materials</option>
                <option value="Logistics Carriers">Logistics Carriers</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Quality Trust Rating (Stars)</label>
              <select 
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value) || 5)}
                className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (Perfect Quality)</option>
                <option value={4}>⭐⭐⭐⭐ (Reliable)</option>
                <option value={3}>⭐⭐⭐ (Average)</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingInline(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm"
                className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Register Vendor
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Directory filtering */}
      <div className="relative max-w-md bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search suppliers by name, point of contact, or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-zinc-800 border border-slate-200/40 dark:border-zinc-700 rounded-lg outline-hidden text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      {/* Grid vendor display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-slate-450 font-mono">
            No active component suppliers discovered matching search query.
          </div>
        ) : (
          filteredSuppliers.map((sup) => (
            <div key={sup.id} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-350 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between">
              
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-zinc-50 leading-tight">
                      {sup.company}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase mt-0.5">
                      {sup.category}
                    </span>
                  </div>
                  
                  <Badge variant="success">ACTIVE</Badge>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: sup.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">({sup.rating}/5)</span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2 font-mono text-[10px] text-slate-600 dark:text-zinc-450">
                  <div className="flex items-center gap-1.5 font-sans font-bold text-slate-800 dark:text-zinc-300">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact: {sup.contactName || sup.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sup.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sup.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                <button 
                  onClick={() => handleDelete(sup.id, sup.company)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                  title="Unregister Supplier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default function SuppliersPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <SuppliersContent />
      </AdminLayout>
    </AppProviders>
  );
}
