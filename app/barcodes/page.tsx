'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { AppProviders } from '@/providers/AppProviders';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { 
  Plus, 
  Search, 
  Printer, 
  Barcode, 
  QrCode, 
  CheckCircle,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

function BarcodesContent() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { barcodes, stock, addBarcode, deleteBarcode } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Form State
  const [selectedSku, setSelectedSku] = React.useState('');
  const [barcodeType, setBarcodeType] = React.useState<'EAN-13' | 'QR-CODE' | 'CODE-128'>('CODE-128');

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Inventory', href: '/inventory/dashboard' },
      { label: 'Barcode Management' }
    ]);
    setActiveMenuId('inventory');
  }, [setBreadcrumbs, setActiveMenuId]);

  // Unique list of products from stock to choose from
  const catalogProducts = React.useMemo(() => {
    return Array.from(new Set(stock.map(s => JSON.stringify({ sku: s.sku, name: s.productName })))).map(s => JSON.parse(s));
  }, [stock]);

  React.useEffect(() => {
    if (catalogProducts.length > 0 && !selectedSku) {
      const firstSku = catalogProducts[0].sku;
      Promise.resolve().then(() => {
        setSelectedSku(prev => prev || firstSku);
      });
    }
  }, [catalogProducts, selectedSku]);

  const handleCreateBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSku) {
      toast.error('Please select an item SKU.');
      return;
    }

    const match = stock.find(s => s.sku === selectedSku);
    const productName = match ? match.productName : 'Unclassified Item';

    // Check if SKU already has this barcode type registered
    const exists = barcodes.some(b => b.sku === selectedSku && b.type === barcodeType);
    if (exists) {
      toast.error(`A barcode of type "${barcodeType}" is already mapped to SKU "${selectedSku}".`);
      return;
    }

    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000).toString();
    const barcodeVal = barcodeType === 'EAN-13' ? `890${randomSuffix}` : `AERO-LN-${randomSuffix.slice(0, 4)}`;

    addBarcode({
      sku: selectedSku,
      productName,
      barcode: barcodeVal,
      type: barcodeType,
      status: 'ACTIVE',
    });

    toast.success(`Barcode generated for "${productName}". Mapped code: ${barcodeVal}`);
    setIsGenerating(false);
  };

  const handlePrint = (barcodeVal: string) => {
    toast.success(`Broadcasting to print queue... Barcode "${barcodeVal}" sent to thermal printer Zebra ZT411 (Depot Floor).`);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Unlink barcode ${code}?`)) {
      deleteBarcode(id);
      toast.success(`Barcode unmapped successfully.`);
    }
  };

  const filteredBarcodes = barcodes.filter(b => 
    b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="barcodes-root">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Barcode & Label Provisioning
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate and map barcodes to registered catalog SKUs. Print adhesive tracking stickers on thermal hardware for immediate bin assignment.
          </p>
        </div>
        <div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsGenerating(!isGenerating)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {isGenerating ? 'Close Generator' : 'Generate Asset Barcode'}
          </Button>
        </div>
      </div>

      {/* Generator Form */}
      {isGenerating && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-450">
            Generate Label Sticker Vector
          </h3>

          <form onSubmit={handleCreateBarcode} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Target Product SKU</label>
              <select 
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full text-xs font-bold font-mono p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                {catalogProducts.map(p => (
                  <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Symbology Type</label>
              <select 
                value={barcodeType}
                onChange={(e: any) => setBarcodeType(e.target.value)}
                className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 outline-hidden"
              >
                <option value="CODE-128">Code 128 (Standard Logistics)</option>
                <option value="EAN-13">EAN-13 (Retail Standard)</option>
                <option value="QR-CODE">QR-Code (Immersion Asset)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsGenerating(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm"
                className="dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Generate Code
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Barcode Search filter */}
      <div className="relative max-w-md bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search barcodes by SKU, product name, or barcode..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-zinc-800 border border-slate-200/40 dark:border-zinc-700 rounded-lg outline-hidden text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      {/* Barcodes Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBarcodes.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-slate-450 font-mono">
            No mapped barcodes discovered in system cache matching search.
          </div>
        ) : (
          filteredBarcodes.map((bc) => (
            <div key={bc.id} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-350 dark:hover:border-zinc-700 transition-colors">
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm leading-tight max-w-[150px] truncate" title={bc.productName}>
                      {bc.productName}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">{bc.sku}</span>
                  </div>
                  <Badge variant="info">{bc.type}</Badge>
                </div>

                {/* Vector simulated barcode box */}
                <div className="bg-slate-50 dark:bg-zinc-850 p-4 border border-slate-100 dark:border-zinc-800/80 rounded-lg flex flex-col items-center justify-center space-y-2">
                  {bc.type === 'QR-CODE' ? (
                    <div className="w-16 h-16 bg-slate-900 dark:bg-zinc-100 p-1 flex items-center justify-center rounded-sm">
                      <QrCode className="w-14 h-14 text-white dark:text-zinc-900" />
                    </div>
                  ) : (
                    <div className="w-full h-10 flex items-center justify-center font-mono tracking-[4px] font-extrabold select-none">
                      ||| | | |||| | || || | | || |
                    </div>
                  )}
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 select-all">
                    {bc.barcode}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between mt-4">
                <button 
                  onClick={() => handleDelete(bc.id, bc.barcode)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                  title="Unmap barcode"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Button 
                  onClick={() => handlePrint(bc.barcode)}
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] font-bold py-1 px-2.5 h-auto"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Zebra Print
                </Button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default function BarcodesPage() {
  return (
    <AppProviders>
      <AdminLayout>
        <BarcodesContent />
      </AdminLayout>
    </AppProviders>
  );
}
