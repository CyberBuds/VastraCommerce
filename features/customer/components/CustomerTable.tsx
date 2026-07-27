'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/types/customer';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge, Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { 
  useBulkDeleteCustomers, 
  useBulkUpdateCustomerStatus, 
  useBulkAssignCustomerGroup,
  useCustomerGroups,
  useWalletAdjustment,
  usePointsAdjustment,
  useDeleteCustomer
} from '@/hooks/useCustomers';
import { Eye, Edit2, Wallet, Coins, Trash2, ShieldAlert, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
}

export function CustomerTable({ customers, isLoading }: CustomerTableProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState('');
  
  // Quick actions modal state
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [adjustType, setAdjustType] = React.useState<'WALLET' | 'POINTS' | null>(null);
  const [adjustForm, setAdjustForm] = React.useState({
    type: 'CREDIT' as 'CREDIT' | 'DEBIT' | 'EARNED' | 'REDEEMED',
    amount: '',
    purpose: 'DEPOSIT' as any,
    reason: '',
    notes: ''
  });

  // Services Hooks
  const bulkDeleteMutation = useBulkDeleteCustomers();
  const bulkStatusMutation = useBulkUpdateCustomerStatus();
  const bulkGroupMutation = useBulkAssignCustomerGroup();
  const deleteMutation = useDeleteCustomer();
  const walletMutation = useWalletAdjustment();
  const pointsMutation = usePointsAdjustment();
  const { data: groups = [] } = useCustomerGroups();

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const value = parseFloat(adjustForm.amount);
    if (isNaN(value) || value <= 0) return;

    walletMutation.mutate({
      customerId: selectedCustomer.id,
      data: {
        type: adjustForm.type === 'DEBIT' ? 'DEBIT' : 'CREDIT',
        amount: value,
        purpose: adjustForm.purpose,
        notes: adjustForm.notes || 'Manual balance correction',
        approvedBy: 'CRM Desk Officer'
      }
    }, {
      onSuccess: () => {
        setSelectedCustomer(null);
        setAdjustType(null);
        setAdjustForm({ type: 'CREDIT', amount: '', purpose: 'DEPOSIT', reason: '', notes: '' });
      }
    });
  };

  const handlePointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const value = parseInt(adjustForm.amount);
    if (isNaN(value) || value <= 0) return;

    pointsMutation.mutate({
      customerId: selectedCustomer.id,
      data: {
        type: adjustForm.type === 'REDEEMED' ? 'REDEEMED' : 'EARNED',
        points: value,
        reason: adjustForm.reason || 'SLA Correction adjustment'
      }
    }, {
      onSuccess: () => {
        setSelectedCustomer(null);
        setAdjustType(null);
        setAdjustForm({ type: 'CREDIT', amount: '', purpose: 'DEPOSIT', reason: '', notes: '' });
      }
    });
  };

  // Bulk operation triggers mapped to store mutators
  const handleBulkDelete = (rows: Customer[]) => {
    if (confirm(`Are you sure you want to permanently delete these ${rows.length} customers?`)) {
      bulkDeleteMutation.mutate(rows.map(r => r.id));
    }
  };

  const handleBulkStatusChange = (rows: Customer[], status: string) => {
    bulkStatusMutation.mutate({
      ids: rows.map(r => r.id),
      status: status as any
    });
  };

  const columns = React.useMemo<ColumnDef<Customer, any>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="rounded-sm border-slate-300 text-slate-800 h-4 w-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded-sm border-slate-300 text-slate-800 h-4 w-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'ID',
      accessorKey: 'customerCode',
      header: 'Code ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-500">
          {row.getValue('ID')}
        </span>
      ),
    },
    {
      id: 'Name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: 'Customer Details',
      cell: ({ row }) => {
        const cust = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-200 overflow-hidden border border-slate-200 dark:border-zinc-750">
              {cust.avatarUrl ? (
                <img src={cust.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                `${cust.firstName[0]}${cust.lastName[0]}`
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                {cust.firstName} {cust.lastName}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {cust.email} | {cust.phone}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'Group',
      accessorKey: 'groupName',
      header: 'Pricing Group',
      cell: ({ row }) => {
        const gName = row.getValue('Group') as string;
        let badgeVar: 'neutral' | 'info' | 'success' | 'warning' = 'neutral';
        if (gName.includes('VIP')) badgeVar = 'info';
        if (gName.includes('Wholesale')) badgeVar = 'success';
        if (gName.includes('Premium')) badgeVar = 'warning';
        return <Badge variant={badgeVar}>{gName}</Badge>;
      },
    },
    {
      id: 'Wallet',
      accessorKey: 'walletBalance',
      header: 'Wallet Balance',
      cell: ({ row }) => {
        const bal = row.getValue('Wallet') as number;
        return (
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
            ₹{bal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      id: 'Rewards',
      accessorKey: 'rewardPoints',
      header: 'Reward Points',
      cell: ({ row }) => {
        const pts = row.getValue('Rewards') as number;
        return (
          <span className="font-mono text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            {pts.toLocaleString()} pts
          </span>
        );
      },
    },
    {
      id: 'Status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('Status') as string;
        return (
          <Badge
            variant={
              status === 'ACTIVE' ? 'success' : status === 'INACTIVE' ? 'neutral' : 'error'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'Onboarded',
      accessorKey: 'createdAt',
      header: 'Created On',
      cell: ({ row }) => {
        const dateStr = row.getValue('Onboarded') as string;
        return (
          <span className="text-slate-400 font-mono text-[10px]">
            {new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        );
      },
    },
    {
      id: 'Actions',
      header: () => <div className="text-right w-full">Quick Controls</div>,
      cell: ({ row }) => {
        const cust = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push(`/dashboard/customers/view/${cust.id}`)}
              title="View 360° Profile"
            >
              <Eye className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push(`/dashboard/customers/edit/${cust.id}`)}
              title="Edit Profile Settings"
            >
              <Edit2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setSelectedCustomer(cust);
                setAdjustType('WALLET');
                setAdjustForm(prev => ({ ...prev, type: 'CREDIT', purpose: 'DEPOSIT' }));
              }}
              title="Adjust Wallet"
            >
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setSelectedCustomer(cust);
                setAdjustType('POINTS');
                setAdjustForm(prev => ({ ...prev, type: 'EARNED' }));
              }}
              title="Adjust Points"
            >
              <Coins className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (confirm(`Permanently delete account for ${cust.firstName} ${cust.lastName}? This operation is irreversible.`)) {
                  deleteMutation.mutate(cust.id);
                }
              }}
              title="Delete Account"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ], [router]);

  return (
    <div className="w-full relative" id="customer-table-root">
      <EnterpriseTable
        data={customers}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />

      {/* QUICK WALLET ADJUSTMENT MICRO DIALOG */}
      {selectedCustomer && adjustType === 'WALLET' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleWalletSubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-100 flex items-center">
                <Wallet className="w-4 h-4 mr-2 text-emerald-500" />
                Wallet Ledger Adjustment
              </h4>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-500">
                Correcting balance for <b>{selectedCustomer.firstName} {selectedCustomer.lastName}</b>. Current balance is <b>₹{selectedCustomer.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustForm(p => ({ ...p, type: 'CREDIT' }))}
                  className={`p-2 rounded-lg border text-xs font-bold transition-colors ${adjustForm.type === 'CREDIT' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                >
                  Credit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustForm(p => ({ ...p, type: 'DEBIT' }))}
                  className={`p-2 rounded-lg border text-xs font-bold transition-colors ${adjustForm.type === 'DEBIT' ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                >
                  Debit (-)
                </button>
              </div>

              <Input
                label="Adjustment Amount (INR) *"
                type="number"
                step="0.01"
                placeholder="e.g. 500.00"
                required
                value={adjustForm.amount}
                onChange={(e) => setAdjustForm(p => ({ ...p, amount: e.target.value }))}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Transaction Purpose</label>
                <select
                  value={adjustForm.purpose}
                  onChange={(e: any) => setAdjustForm(p => ({ ...p, purpose: e.target.value }))}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-hidden text-slate-900 dark:text-zinc-100"
                >
                  <option value="DEPOSIT">Customer Fund Deposit</option>
                  <option value="REFUND">Order Cancellation Refund</option>
                  <option value="ADJUSTMENT">SLA / Admin Correction</option>
                  <option value="ORDER_PAYMENT">Order Purchase Payment</option>
                </select>
              </div>

              <Textarea
                label="Ledger Remarks *"
                placeholder="Explain the audit reason for manual correction..."
                required
                value={adjustForm.notes}
                onChange={(e) => setAdjustForm(p => ({ ...p, notes: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" isLoading={walletMutation.isPending}>
                <Check className="w-4 h-4 mr-1.5" /> Commit Ledger Entry
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK REWARDS ADJUSTMENT MICRO DIALOG */}
      {selectedCustomer && adjustType === 'POINTS' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handlePointsSubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-100 flex items-center">
                <Coins className="w-4 h-4 mr-2 text-amber-500" />
                Loyalty Reward Points adjustment
              </h4>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-500">
                Adjusting points for <b>{selectedCustomer.firstName} {selectedCustomer.lastName}</b>. Current points balance is <b>{selectedCustomer.rewardPoints.toLocaleString()} pts</b>.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustForm(p => ({ ...p, type: 'EARNED' }))}
                  className={`p-2 rounded-lg border text-xs font-bold transition-colors ${adjustForm.type === 'EARNED' ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                >
                  Earn Points (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustForm(p => ({ ...p, type: 'REDEEMED' }))}
                  className={`p-2 rounded-lg border text-xs font-bold transition-colors ${adjustForm.type === 'REDEEMED' ? 'bg-rose-50 border-rose-300 text-rose-850 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                >
                  Redeem Points (-)
                </button>
              </div>

              <Input
                label="Loyalty Score Delta *"
                type="number"
                placeholder="e.g. 100"
                required
                value={adjustForm.amount}
                onChange={(e) => setAdjustForm(p => ({ ...p, amount: e.target.value }))}
              />

              <Input
                label="Adjustment Reason *"
                placeholder="e.g. Promo Campaign points bonus, Customer satisfaction credit..."
                required
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm(p => ({ ...p, reason: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" isLoading={pointsMutation.isPending}>
                <Check className="w-4 h-4 mr-1.5" /> Adjust Score
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
