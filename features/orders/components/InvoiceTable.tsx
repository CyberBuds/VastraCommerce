'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Invoice } from '@/types/order';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge, Button } from '@/components/enterprise/BaseInputs';
import { useInvoices, usePayInvoice, useVoidInvoice } from '@/hooks/useOrders';
import { FileText, CheckCircle2, Ban, Eye, Printer, Landmark } from 'lucide-react';

export function InvoiceTable() {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { data: invoices = [], isLoading } = useInvoices();
  
  const payInvoiceMutation = usePayInvoice();
  const voidInvoiceMutation = useVoidInvoice();

  // Selected invoice for invoice detail print view
  const [viewedInvoice, setViewedInvoice] = React.useState<Invoice | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const columns = React.useMemo<ColumnDef<Invoice, any>[]>(() => [
    {
      id: 'InvoiceNumber',
      accessorKey: 'invoiceNumber',
      header: 'Tax Invoice Number',
      cell: ({ row }) => (
        <button
          onClick={() => setViewedInvoice(row.original)}
          className="font-mono text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-left"
        >
          {row.getValue('InvoiceNumber')}
        </button>
      ),
    },
    {
      id: 'OrderNumber',
      accessorKey: 'orderNumber',
      header: 'Linked Order',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-500">
          {row.getValue('OrderNumber')}
        </span>
      ),
    },
    {
      id: 'Customer',
      accessorKey: 'customerName',
      header: 'Billed Customer',
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-zinc-150 text-xs">{inv.customerName}</span>
            <span className="text-[10px] text-slate-400 font-mono">{inv.customerEmail}</span>
          </div>
        );
      },
    },
    {
      id: 'IssuedDate',
      accessorKey: 'issuedDate',
      header: 'Billing Date',
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-slate-500">
          {row.getValue('IssuedDate')}
        </span>
      ),
    },
    {
      id: 'DueDate',
      accessorKey: 'dueDate',
      header: 'Credit Term Due',
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-slate-500">
          {row.getValue('DueDate')}
        </span>
      ),
    },
    {
      id: 'Total',
      accessorKey: 'totalAmount',
      header: 'Taxed Total',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-zinc-50">
          ₹{(row.getValue('totalAmount') as number).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      id: 'Status',
      accessorKey: 'status',
      header: 'Payment Status',
      cell: ({ row }) => {
        const val = row.getValue('Status') as string;
        return (
          <Badge
            variant={
              val === 'PAID' ? 'success' : val === 'VOID' ? 'neutral' : 'error'
            }
          >
            {val}
          </Badge>
        );
      },
    },
    {
      id: 'Actions',
      header: () => <div className="text-right">Controls</div>,
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewedInvoice(inv)}
              title="View Print invoice"
            >
              <Eye className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            </Button>
            {inv.status === 'SENT' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (confirm(`Mark Invoice #${inv.invoiceNumber} as cleared (PAID)? This updates linked order states automatically.`)) {
                      payInvoiceMutation.mutate(inv.id);
                    }
                  }}
                  title="Mark Paid"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (confirm(`Void Invoice #${inv.invoiceNumber}?`)) {
                      voidInvoiceMutation.mutate(inv.id);
                    }
                  }}
                  title="Void Invoice"
                >
                  <Ban className="w-4 h-4 text-rose-500" />
                </Button>
              </>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ], [invoices]);

  return (
    <div className="w-full relative" id="invoices-table-root">
      <EnterpriseTable
        data={invoices}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />

      {/* ==========================================
          DETAILED BILL OF LADING PRINT VIEW MODAL
          ========================================== */}
      {viewedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            
            {/* Header branding */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-zinc-850 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2 font-mono">
                  <Landmark className="w-5 h-5 text-indigo-500" />
                  AeroCore Industries Ltd
                </h3>
                <p className="text-slate-400 mt-0.5 font-medium">B2B Heavy Machinery Metallurgy Division</p>
                <p className="text-slate-400 font-mono text-[10px]">GSTIN: 27AAAAA1111A1Z1</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-slate-400 font-bold uppercase block tracking-wider text-[9px]">Tax Invoice</span>
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200 block mt-0.5">{viewedInvoice.invoiceNumber}</span>
                <Badge variant={viewedInvoice.status === 'PAID' ? 'success' : 'error'} className="mt-2.5 font-mono">{viewedInvoice.status}</Badge>
              </div>
            </div>

            {/* Invoicing details split layout */}
            <div className="grid grid-cols-2 gap-6 font-mono text-[11px] leading-relaxed">
              <div>
                <span className="text-slate-400 font-bold uppercase block tracking-wider text-[9px] mb-1">BILLED TO</span>
                <p className="font-extrabold text-slate-800 dark:text-zinc-200">{viewedInvoice.customerName}</p>
                <p className="text-slate-500">{viewedInvoice.customerEmail}</p>
                <p className="text-slate-400">Ledger Acc ID: {viewedInvoice.customerId}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold uppercase block tracking-wider text-[9px] mb-1">LEDGER METADATA</span>
                <p className="text-slate-500">Order Ref: <b>{viewedInvoice.orderNumber}</b></p>
                <p className="text-slate-500">Billing Date: <b>{viewedInvoice.issuedDate}</b></p>
                <p className="text-slate-500">Terms Due: <b>{viewedInvoice.dueDate}</b></p>
                {viewedInvoice.paidAt && <p className="text-emerald-600 dark:text-emerald-400 font-bold">Cleared: {new Date(viewedInvoice.paidAt).toLocaleDateString()}</p>}
              </div>
            </div>

            {/* Line items mock table */}
            <div className="border border-slate-150 dark:border-zinc-800 rounded-lg overflow-hidden font-mono text-[11px]">
              <div className="grid grid-cols-12 bg-slate-50 dark:bg-zinc-850 p-2.5 border-b border-slate-150 dark:border-zinc-800 font-bold text-slate-500 text-[10px]">
                <div className="col-span-8 uppercase">Item / Component Description</div>
                <div className="col-span-4 text-right uppercase">Ledger Line Total</div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-zinc-800 p-2.5 space-y-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-8 font-bold text-slate-700 dark:text-zinc-300">AeroSpace Contract Assemblies and Metallurgy Components</div>
                  <div className="col-span-4 text-right font-extrabold text-slate-900 dark:text-zinc-100">₹{viewedInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>

            {/* Totals ledger box */}
            <div className="flex flex-col items-end gap-1.5 border-t border-slate-100 dark:border-zinc-850 pt-4 font-mono text-[11px] text-slate-500 pr-1">
              <div className="flex justify-between w-52">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300">₹{viewedInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-52">
                <span>GST Tax (18%):</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300">₹{viewedInvoice.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-52 text-xs text-slate-900 dark:text-zinc-50 font-extrabold border-t border-slate-150 dark:border-zinc-800 pt-2 mt-1">
                <span>Billed Total:</span>
                <span>₹{viewedInvoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Print and control actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="h-8 px-3 font-mono">
                <Printer className="w-4 h-4 mr-1.5" /> Print/Export PDF
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={() => setViewedInvoice(null)} className="h-8 px-4 font-mono">
                Close Invoice View
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
