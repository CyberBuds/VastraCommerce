'use client';

import * as React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Badge } from '@/components/enterprise/BaseInputs';
import { Coins, Search, Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerRewardPointsPage() {
  const router = useRouter();
  const { data: customers = [], isLoading } = useCustomers();
  const [searchQuery, setSearchQuery] = React.useState('');

  const totalPoints = customers.reduce((sum, c) => sum + c.rewardPoints, 0);

  const allLogs = React.useMemo(() => {
    return customers.flatMap(c => 
      c.rewardPointsHistory.map(t => ({
        ...t,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode,
        id: c.id
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [customers]);

  const filteredLogs = allLogs.filter(log => 
    log.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="customer-rewards-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Coins className="w-5.5 h-5.5 text-slate-800" />
            Consolidated Loyalty Rewards Ledger
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage, verify, and correct consumer points accumulations and program redemptions.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><Coins className="w-5.5 h-5.5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Circulating Points Pool</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{totalPoints.toLocaleString()} pts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><TrendingUp className="w-5.5 h-5.5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Total Program Activities</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{allLogs.length} entries</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><Star className="w-5.5 h-5.5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Average points / user</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{(totalPoints / (customers.length || 1)).toFixed(0)} pts</span>
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-zinc-850 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">program audit history</h3>
          
          <div className="relative w-full sm:w-64 text-xs">
            <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
            <input
              type="text"
              placeholder="Search user, reason..."
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
                <th className="py-2 px-3">Reason</th>
                <th className="py-2 px-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic font-semibold">No loyalty logs matched query.</td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={`${log.id}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <button 
                        onClick={() => router.push(`/dashboard/customers/view/${log.id}`)}
                        className="font-bold text-slate-800 dark:text-zinc-200 hover:underline text-left block"
                      >
                        {log.customerName}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">{log.customerCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={log.type === 'EARNED' ? 'success' : 'error'}>
                        {log.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-semibold">{log.reason}</td>
                    <td className={`py-3 px-3 text-right font-bold font-mono ${log.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {log.type === 'EARNED' ? '+' : '-'}{log.points} pts
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
