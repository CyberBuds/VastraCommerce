'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ReturnRequest, ReturnStatus } from '@/types/order';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge, Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { useReturns, useProcessReturn } from '@/hooks/useOrders';
import { 
  History, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  FileText,
  Boxes,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function ReturnTable() {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { data: returns = [], isLoading } = useReturns();
  const processReturnMutation = useProcessReturn();

  // Selected return request for processing details modal
  const [selectedReturnId, setSelectedReturnId] = React.useState<string | null>(null);
  const selectedReturn = React.useMemo(() => {
    return selectedReturnId ? returns.find(r => r.id === selectedReturnId) || null : null;
  }, [returns, selectedReturnId]);

  const handleProcess = (status: 'APPROVED' | 'REJECTED' | 'COMPLETED', customAmt?: number) => {
    if (!selectedReturn) return;

    if (confirm(`Are you sure you want to change Return Request #${selectedReturn.returnNumber} status to ${status}?`)) {
      // Create simple item status mappings (set all to RECEIVED if approved/completed, or REJECTED)
      const itemStatuses: Record<string, any> = {};
      selectedReturn.items.forEach(it => {
        itemStatuses[it.id] = status === 'APPROVED' || status === 'COMPLETED' ? 'RECEIVED' : 'REJECTED';
      });

      processReturnMutation.mutate({
        id: selectedReturn.id,
        data: {
          status,
          itemStatuses,
          customRefundAmount: customAmt
        }
      }, {
        onSuccess: () => {
          setSelectedReturnId(null);
        }
      });
    }
  };

  const columns = React.useMemo<ColumnDef<ReturnRequest, any>[]>(() => [
    {
      id: 'ReturnNumber',
      accessorKey: 'returnNumber',
      header: 'Return Reference',
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedReturnId(row.original.id)}
          className="font-mono text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-left"
        >
          {row.getValue('ReturnNumber')}
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
      header: 'Returning Customer',
      cell: ({ row }) => (
        <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs">
          {row.getValue('Customer')}
        </span>
      ),
    },
    {
      id: 'Reason',
      accessorKey: 'reason',
      header: 'Reason for Return',
      cell: ({ row }) => (
        <span className="text-slate-500 truncate max-w-xs block font-medium">
          {row.getValue('Reason')}
        </span>
      ),
    },
    {
      id: 'Date',
      accessorKey: 'createdAt',
      header: 'Requested On',
      cell: ({ row }) => (
        <span className="text-slate-400 font-mono text-[10px]">
          {new Date(row.getValue('Date')).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
    {
      id: 'RefundAmount',
      accessorKey: 'refundAmount',
      header: 'Authorised Refund',
      cell: ({ row }) => {
        const val = row.getValue('RefundAmount') as number;
        const toWallet = row.original.refundToWallet;
        return (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-extrabold text-slate-950 dark:text-zinc-50">
              ₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">{toWallet ? 'Wallet Credit' : 'Card Refund'}</span>
          </div>
        );
      },
    },
    {
      id: 'Status',
      accessorKey: 'status',
      header: 'Auditor Decision',
      cell: ({ row }) => {
        const val = row.getValue('Status') as ReturnStatus;
        let bVariant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
        if (['APPROVED', 'COMPLETED'].includes(val)) bVariant = 'success';
        if (val === 'PENDING') bVariant = 'warning';
        if (val === 'REJECTED') bVariant = 'error';

        return <Badge variant={bVariant}>{val}</Badge>;
      },
    },
    {
      id: 'Actions',
      header: () => <div className="text-right">Controls</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setSelectedReturnId(row.original.id)}
            title="Inspect Return Request"
          >
            <Eye className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ], [returns]);

  return (
    <div className="w-full relative" id="returns-table-root">
      <EnterpriseTable
        data={returns}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />

      {/* ==========================================
          DETAILED INSPECTION & REFUND PROCESSING MODAL
          ========================================== */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-xs max-h-[85vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-50 flex items-center gap-2">
                <RefreshCw className="w-4.5 h-4.5 text-indigo-500" />
                RETURN RMA AUDITING: {selectedReturn.returnNumber}
              </h4>
              <button type="button" onClick={() => setSelectedReturnId(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* General metadata */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-950/40 p-4 border border-slate-200/50 dark:border-zinc-800 rounded-xl font-mono leading-relaxed">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Linked Order</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs">{selectedReturn.orderNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Returning Client</span>
                <span className="font-bold text-slate-850 dark:text-zinc-200 text-xs">{selectedReturn.customerName}</span>
              </div>
            </div>

            {/* Return items listings */}
            <div className="space-y-3.5">
              <h5 className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-indigo-500" />
                RMA Inspected line Items ({selectedReturn.items.length})
              </h5>
              
              <div className="divide-y divide-slate-100 dark:divide-zinc-800 border border-slate-150 dark:border-zinc-800 rounded-lg overflow-hidden font-mono text-[11px] bg-white dark:bg-zinc-950/10">
                {selectedReturn.items.map((it) => (
                  <div key={it.id} className="p-3 flex justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-zinc-150">{it.productName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">SKU: {it.sku} | Unit Price: ₹{it.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block uppercase font-bold text-[9px]">QTY: {it.quantityReturned} / {it.quantityOrdered}</span>
                      <Badge variant="neutral" className="mt-1 text-[8px] font-bold px-1 py-0">{it.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason details */}
            <div className="space-y-1 text-slate-500">
              <span className="font-bold text-slate-400 font-mono uppercase text-[9px] block">RMA Defect / Return Explanation</span>
              <p className="bg-slate-50 dark:bg-zinc-950/25 border border-slate-200/50 dark:border-zinc-800 rounded-lg p-3 font-medium leading-relaxed italic text-slate-700 dark:text-zinc-300">
                &quot;{selectedReturn.reason}&quot;
              </p>
              {selectedReturn.notes && (
                <p className="mt-1 text-[10px] text-slate-400">Operator notes: {selectedReturn.notes}</p>
              )}
            </div>

            {/* Financial Refund summary */}
            <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl flex justify-between items-center font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Refund Method</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200 block mt-1">
                  {selectedReturn.refundToWallet ? 'Direct CRM Wallet Credit' : 'Original Payment gateway'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Grand Reversal Value</span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 block mt-1">
                  ₹{selectedReturn.refundAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Decision making panel */}
            {selectedReturn.status === 'PENDING' ? (
              <div className="border-t border-slate-100 dark:border-zinc-850 pt-4 space-y-3.5">
                <span className="font-bold text-slate-400 font-mono uppercase text-[9px] block">RMA Desk Signoff Actions</span>
                
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 font-mono text-[11px]"
                    onClick={() => handleProcess('APPROVED')}
                    isLoading={processReturnMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Approve & Refund Wallet
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-850 font-bold dark:border-rose-800 dark:hover:bg-rose-950/20 font-mono text-[11px]"
                    onClick={() => handleProcess('REJECTED')}
                    isLoading={processReturnMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Reject RMA Claim
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 dark:border-zinc-850 pt-4 text-center text-slate-400 flex flex-col items-center gap-1.5 py-2">
                <Badge variant={selectedReturn.status === 'APPROVED' || selectedReturn.status === 'COMPLETED' ? 'success' : 'error'} className="font-mono">
                  DECISION: {selectedReturn.status}
                </Badge>
                <p className="text-[10px] font-medium">This RMA Ledger record is closed. Audit log modifications are complete.</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedReturnId(null)}>Close Inspection</Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
