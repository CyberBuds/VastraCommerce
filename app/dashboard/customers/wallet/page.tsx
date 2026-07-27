'use client';

import * as React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Badge, Button } from '@/components/enterprise/BaseInputs';
import { Wallet, Search, Coins, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerWalletPage() {
  const router = useRouter();
  const { data: customers = [], isLoading } = useCustomers();
  const [searchQuery, setSearchQuery] = React.useState('');

  const totalWallet = customers.reduce((sum, c) => sum + c.walletBalance, 0);

  // Compile all transactions
  const allTransactions = React.useMemo(() => {
    return customers.flatMap(c => 
      c.walletTransactions.map(t => ({
        ...t,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode,
        id: c.id
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [customers]);

  const filteredTx = allTransactions.filter(tx => 
    tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6" id="customer-wallet-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Wallet className="w-5.5 h-5.5 text-slate-800" />
            Consolidated Financial Wallets Ledger
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Audit credit adjustments, fund refunds, and manual corrections performed across all client profiles.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><Wallet className="w-5.5 h-5.5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Global Reserves Asset Pool</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">₹{totalWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><TrendingUp className="w-5.5 h-5.5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Consolidated Transactions</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{allTransactions.length} operations</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><Coins className="w-5.5 h-5.5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Average balance</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">₹{(totalWallet / (customers.length || 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-zinc-850 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">audit ledger lines</h3>
          
          <div className="relative w-full sm:w-64 text-xs">
            <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
            <input
              type="text"
              placeholder="Search user, purpose, remark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-xs font-medium">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-850 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Purpose</th>
                <th className="py-2 px-3 text-right">Delta</th>
                <th className="py-2 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic font-semibold">No audit lines matched query.</td>
                </tr>
              ) : (
                filteredTx.map((tx, idx) => (
                  <tr key={`${tx.id}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <button 
                        onClick={() => router.push(`/dashboard/customers/view/${tx.id}`)}
                        className="font-bold text-slate-800 dark:text-zinc-200 hover:underline text-left block"
                      >
                        {tx.customerName}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.customerCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={tx.type === 'CREDIT' ? 'success' : 'error'}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] font-bold">{tx.purpose}</td>
                    <td className={`py-3 px-3 text-right font-bold font-mono ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {tx.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
