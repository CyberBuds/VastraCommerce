'use client';

import * as React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Badge } from '@/components/enterprise/BaseInputs';
import { Activity, Clock, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsolidatedActivityTimelinePage() {
  const router = useRouter();
  const { data: customers = [] } = useCustomers();
  const [searchQuery, setSearchQuery] = React.useState('');

  const allLogs = React.useMemo(() => {
    return customers.flatMap(c => 
      c.activityLogs.map(log => ({
        ...log,
        customerId: c.id,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [customers]);

  const filteredLogs = allLogs.filter(log => 
    log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="crm-activity-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Activity className="w-5.5 h-5.5 text-slate-800" />
            Consolidated CRM Audit Timeline
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor a real-time ledger stream of logins, profile modifications, wallet balances delta corrections, and helpdesk SLA closures.
          </p>
        </div>
      </div>

      {/* Filter box */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 p-4 rounded-xl shadow-2xs text-xs">
        <h3 className="font-bold uppercase tracking-wider font-mono text-slate-400">audit stream filters</h3>
        
        <div className="relative w-full sm:w-64 text-xs">
          <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
          <input
            type="text"
            placeholder="Search action description, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-hidden"
          />
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
        <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-6 ml-4 space-y-8">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-400 italic text-center py-6 text-xs font-semibold">Timeline is clear.</p>
          ) : (
            filteredLogs.map((log, idx) => (
              <div key={`${log.id}-${idx}`} className="relative text-xs">
                {/* Timeline node icon */}
                <span className="absolute -left-10 top-0.5 bg-slate-950 dark:bg-brand text-white p-1 rounded-full border border-white dark:border-zinc-950 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </span>

                <div className="space-y-1 font-medium">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 dark:text-zinc-100">
                      {log.title}
                    </h4>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1 font-mono">{log.action}</Badge>
                    <span className="text-[10px] text-slate-400">by</span>
                    <button 
                      onClick={() => router.push(`/dashboard/customers/view/${log.customerId}`)}
                      className="font-extrabold text-slate-700 dark:text-zinc-300 hover:underline hover:text-slate-900"
                    >
                      {log.customerName}
                    </button>
                    <span className="text-[9px] text-slate-400 font-mono">({log.customerCode})</span>
                  </div>
                  <p className="text-slate-500">{log.description}</p>
                  <span className="text-[9px] text-slate-400 block font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
