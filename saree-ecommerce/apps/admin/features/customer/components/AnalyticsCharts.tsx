'use client';

import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCustomers, useCustomerGroups, useCustomerSegments } from '@/hooks/useCustomers';
import { Users, TrendingUp, DollarSign, Clock, HelpCircle, Heart } from 'lucide-react';

const ACQUISITION_DATA = [
  { month: 'Jan', organic: 120, ads: 80, referrals: 40 },
  { month: 'Feb', organic: 150, ads: 110, referrals: 60 },
  { month: 'Mar', organic: 220, ads: 140, referrals: 90 },
  { month: 'Apr', organic: 290, ads: 180, referrals: 130 },
  { month: 'May', organic: 340, ads: 210, referrals: 170 },
  { month: 'Jun', organic: 410, ads: 250, referrals: 240 },
];

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsCharts() {
  const { data: customers = [] } = useCustomers();
  const { data: groups = [] } = useCustomerGroups();
  const { data: segments = [] } = useCustomerSegments();

  // Compute stats
  const totalCount = customers.length;
  const activeCount = customers.filter(c => c.status === 'ACTIVE').length;
  const totalWallet = customers.reduce((sum, c) => sum + c.walletBalance, 0);
  const totalPoints = customers.reduce((sum, c) => sum + c.rewardPoints, 0);

  // Groups distribution data
  const groupDistribution = React.useMemo(() => {
    const distribution: Record<string, number> = {};
    customers.forEach(c => {
      distribution[c.groupName] = (distribution[c.groupName] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [customers]);

  // Support ticket status data
  const ticketStatusData = React.useMemo(() => {
    const statusCount = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
    customers.forEach(c => {
      c.tickets.forEach(t => {
        if (t.status in statusCount) {
          statusCount[t.status as keyof typeof statusCount]++;
        }
      });
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [customers]);

  return (
    <div className="space-y-6" id="analytics-charts-root">
      {/* 1. Core Summary Stats Deck */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><Users className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Registered CRM Cohort</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{totalCount} users</span>
            <span className="text-[9px] font-semibold text-emerald-600 font-mono block mt-0.5">{activeCount} ACTIVE (100% SLA uptime)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><DollarSign className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Consolidated Wallet Assets</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">₹{totalWallet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-[9px] font-semibold text-slate-400 font-mono block mt-0.5">Average balance is ₹{(totalWallet / (totalCount || 1)).toFixed(0)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Acquisition Lead Growth</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">+38.5%</span>
            <span className="text-[9px] font-semibold text-emerald-600 font-mono block mt-0.5">referral program driving 28.4% share</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><Clock className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Helpdesk SLA resolution</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">98.4%</span>
            <span className="text-[9px] font-semibold text-emerald-600 font-mono block mt-0.5">Average time to first reply: 14 mins</span>
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2: Acquisition Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">onboarding acquisition channel velocity</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Visual representation of user additions through different entry funnels over the last semester.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACQUISITION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace', paddingTop: 10 }} />
                <Area type="monotone" dataKey="organic" stroke="#0f172a" fillOpacity={1} fill="url(#colorOrganic)" strokeWidth={2} name="Organic SEO" />
                <Area type="monotone" dataKey="referrals" stroke="#10b981" fillOpacity={1} fill="url(#colorReferral)" strokeWidth={2} name="Referrals" />
                <Area type="monotone" dataKey="ads" stroke="#3b82f6" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Paid Ads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1: Customer groups distribution */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">customer tier pricing distribution</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Demographic share of consumers enrolled in various loyalty / discounts groups.</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            {groupDistribution.length === 0 ? (
              <span className="text-xs text-slate-400 font-semibold italic">No active groupings loaded</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {groupDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 font-mono">{totalCount}</span>
              <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] font-mono">
            {groupDistribution.map((entry, idx) => (
              <div key={entry.name} className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-600 font-bold">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-900">{entry.value} ({((entry.value / totalCount) * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support ticket load breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">helpdesk ticket state distribution</h3>
          <div className="h-56 w-full">
            {customers.flatMap(c => c.tickets).length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold italic">No support tickets currently recorded in helpdesk database</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                  <YAxis tickLine={false} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                  <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={32}>
                    {ticketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'RESOLVED' || entry.name === 'CLOSED' ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Dynamic Segments Audit list */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Active demographic query segments</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Dynamic user groupings compiled on checkouts and active session parameters.</p>
          </div>

          <div className="space-y-3.5 flex-1 mt-4">
            {segments.length === 0 ? (
              <div className="py-6 text-center text-slate-400 italic">No custom demographic query segments built.</div>
            ) : (
              segments.map((seg) => (
                <div key={seg.id} className="p-3.5 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 dark:text-zinc-200">{seg.name}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-full font-mono text-[10px] font-semibold">{seg.memberCount} members</span>
                  </div>
                  <p className="text-slate-500 text-[10px] mt-1 italic">Query filters: {JSON.stringify(seg.rules || seg.queryConfig || {})}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
