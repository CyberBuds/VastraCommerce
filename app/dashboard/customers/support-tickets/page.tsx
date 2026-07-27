'use client';

import * as React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Badge, Button } from '@/components/enterprise/BaseInputs';
import { AlertCircle, Search, Eye, Clock, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsolidatedSupportTicketsPage() {
  const router = useRouter();
  const { data: customers = [] } = useCustomers();
  const [searchQuery, setSearchQuery] = React.useState('');

  const allTickets = React.useMemo(() => {
    return customers.flatMap(c => 
      c.tickets.map(t => ({
        ...t,
        customerId: c.id,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode
      }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [customers]);

  const stats = React.useMemo(() => {
    const total = allTickets.length;
    const open = allTickets.filter(t => t.status === 'OPEN').length;
    const pending = allTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const high = allTickets.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH').length;
    return { total, open, pending, high };
  }, [allTickets]);

  const filteredTickets = allTickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="customer-tickets-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5.5 h-5.5 text-slate-800" />
            Consolidated Support Helpdesk SLA Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Analyze, track, and reply to client inquiries, billing complaints, and technical shipment logistics errors.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Consolidated Tickets</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{stats.total} logged</span>
          </div>
          <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg"><HelpCircle className="w-4 h-4 text-slate-500" /></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Awaiting Dispatch</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{stats.open} cases</span>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-500"><Clock className="w-4 h-4" /></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">In Active Progress</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{stats.pending} cases</span>
          </div>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-indigo-500"><Clock className="w-4 h-4" /></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">High Priority SLA</span>
            <span className="text-base font-extrabold text-rose-600 font-mono mt-0.5 block">{stats.high} urgent</span>
          </div>
          <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-rose-500"><AlertCircle className="w-4 h-4" /></div>
        </div>
      </div>

      {/* Main Table card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-zinc-850 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">cases registry desk</h3>
          
          <div className="relative w-full sm:w-64 text-xs">
            <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
            <input
              type="text"
              placeholder="Search ID, title, user, category..."
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
                <th className="py-2 px-3">Ticket ID</th>
                <th className="py-2 px-3">Case details</th>
                <th className="py-2 px-3">Department</th>
                <th className="py-2 px-3">Customer Profile</th>
                <th className="py-2 px-3">SLA Priority</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic font-semibold">No tickets found.</td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-800 dark:text-zinc-200 max-w-[200px] truncate">{t.title}</div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Category: {t.category}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] font-bold">{t.department}</td>
                    <td className="py-3 px-3">
                      <button 
                        onClick={() => router.push(`/dashboard/customers/view/${t.customerId}`)}
                        className="font-bold text-slate-800 dark:text-zinc-200 hover:underline text-left block"
                      >
                        {t.customerName}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">{t.customerCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={t.priority === 'URGENT' || t.priority === 'HIGH' ? 'error' : 'neutral'}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'success' : 'warning'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => router.push(`/dashboard/customers/support-tickets/${t.id}`)}
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
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
