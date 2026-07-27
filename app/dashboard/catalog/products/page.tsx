'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useLayoutStore } from '@/store/layoutStore';
import { useCatalogStore } from '@/store/catalogStore';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { ProductWizard } from '@/features/catalog/wizards/ProductWizard';
import { ImportExportTool } from '@/features/catalog/components/ImportExportTool';
import { Plus, Trash2, Edit, Copy, Clock, Search, History, UploadCloud, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK';
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { auditLogs } = useCatalogStore();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'list' | 'bulk' | 'audit'>('list');

  // Wizard state controls
  const [wizardMode, setWizardMode] = React.useState<'closed' | 'create' | 'edit'>('closed');
  const [editingProductId, setEditingProductId] = React.useState<string | undefined>(undefined);

  // Set breadcrumbs & active states
  React.useEffect(() => {
    setActiveMenuId('catalog');
    setBreadcrumbs([
      { label: 'Catalog', href: '/dashboard/catalog/products' },
      { label: 'Products Inventory' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  // Query: Get Products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['catalogProducts'],
    queryFn: async () => {
      const res = await api.get('/api/catalog/products', { params: { limit: 100 } });
      return res.data?.data?.data as CatalogProduct[];
    },
  });

  // Mutation: Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/catalog/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted from active catalogs.');
      queryClient.invalidateQueries({ queryKey: ['catalogProducts'] });
    },
  });

  const handleBulkDelete = (selectedRows: CatalogProduct[]) => {
    selectedRows.forEach((row) => deleteProductMutation.mutate(row.id));
    toast.success(`Dispatched bulk deletion for ${selectedRows.length} catalog items.`);
  };

  const handleBulkStatusChange = (selectedRows: CatalogProduct[], status: string) => {
    selectedRows.forEach(async (row) => {
      await api.put(`/api/catalog/products/${row.id}`, { status });
    });
    queryClient.invalidateQueries({ queryKey: ['catalogProducts'] });
    toast.success(`Bulk status of ${selectedRows.length} rows updated to ${status}`);
  };

  const handleCopySku = (sku: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sku);
      toast.success('SKU copied to clipboard', { description: sku });
    }
  };

  // Define table columns
  const columns = React.useMemo<ColumnDef<CatalogProduct>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            className="rounded-sm border-slate-300 text-slate-850"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.target.checked)}
            className="rounded-sm border-slate-300 text-slate-850"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'sku',
        header: 'SKU Code',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-black text-slate-750 dark:text-zinc-200">
              {row.original.sku}
            </span>
            <button
              type="button"
              onClick={() => handleCopySku(row.original.sku)}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              title="Copy Code"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Commercial Name',
        cell: ({ row }) => (
          <span className="font-bold text-slate-800 dark:text-zinc-150 text-sm">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category Node',
        cell: ({ row }) => (
          <Badge variant="neutral" className="text-[10px] font-bold">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Selling Price',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-slate-800 dark:text-zinc-100">
            ${row.original.price.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock Level',
        cell: ({ row }) => {
          const qty = row.original.stock;
          return (
            <span className={`font-mono font-extrabold text-xs ${qty < 20 ? 'text-red-500' : 'text-slate-650 dark:text-zinc-400'}`}>
              {qty} units
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge variant={status === 'ACTIVE' ? 'success' : 'neutral'} className="text-[9px]">
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 py-1 font-bold text-xs"
              onClick={() => {
                setEditingProductId(row.original.id);
                setWizardMode('edit');
              }}
              icon={Edit}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-red-500 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Remove ${row.original.name} from catalog databases?`)) {
                  deleteProductMutation.mutate(row.original.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteProductMutation]
  );

  // If Wizard is active, render it in full screen workspace layout!
  if (wizardMode !== 'closed') {
    return (
      <div className="space-y-4">
        <ProductWizard
          productId={editingProductId}
          onCancel={() => {
            setWizardMode('closed');
            setEditingProductId(undefined);
          }}
          onComplete={() => {
            setWizardMode('closed');
            setEditingProductId(undefined);
            queryClient.invalidateQueries({ queryKey: ['catalogProducts'] });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="products-page-root">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Corporate Product Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage physical SKUs, digital bundles, logistical packaging, and pricing indexes
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="font-bold text-xs py-2.5"
          onClick={() => setWizardMode('create')}
          icon={Plus}
        >
          Add Product SKU
        </Button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-1 text-xs shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'list'
              ? 'border-brand text-brand dark:border-brand dark:text-brand'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Active Inventory ({productsData?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bulk')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'bulk'
              ? 'border-brand text-brand dark:border-brand dark:text-brand'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1">
            <UploadCloud className="w-3.5 h-3.5" /> Spreadsheet Import/Export
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'audit'
              ? 'border-brand text-brand dark:border-brand dark:text-brand'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1">
            <History className="w-3.5 h-3.5" /> Catalog Change Log ({auditLogs.length})
          </span>
        </button>
      </div>

      {/* Active Tab Contents */}
      {activeTab === 'list' && (
        <Card>
          <EnterpriseTable
            data={productsData || []}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            isLoading={isLoading}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
          />
        </Card>
      )}

      {activeTab === 'bulk' && (
        <Card className="p-6">
          <ImportExportTool />
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2.5">
            <h2 className="text-sm font-black text-slate-850 dark:text-zinc-250 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-brand" />
              Administrative Audit Trail Logs
            </h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 rounded-xl text-xs space-y-1.5 shadow-2xs"
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 dark:text-zinc-250 uppercase">{log.action}</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-slate-500 font-medium">
                    <div>
                      <p>Product: <span className="text-slate-700 dark:text-zinc-300 font-bold">{log.productName}</span></p>
                      <p className="mt-0.5">SKU Code: <span className="font-mono text-[10px]">{log.sku}</span></p>
                    </div>
                    <div className="text-right">
                      <p>Modifier: <span className="text-slate-700 dark:text-zinc-300 font-bold">{log.updatedBy}</span></p>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-4 text-[10px] bg-white dark:bg-zinc-950 p-2 rounded-md border border-slate-100 dark:border-zinc-900 font-mono">
                    <div>
                      <span className="text-red-500 font-bold">Changed From:</span>
                      <p className="mt-0.5 text-slate-600 dark:text-zinc-400">{log.changedFrom}</p>
                    </div>
                    <div className="border-l border-slate-150 dark:border-zinc-800 pl-4">
                      <span className="text-emerald-500 font-bold">Changed To:</span>
                      <p className="mt-0.5 text-slate-600 dark:text-zinc-400">{log.changedTo}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs font-bold">
                No catalog updates logged in this session session.
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
