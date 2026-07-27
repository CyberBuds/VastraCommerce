'use client';

import * as React from 'react';
import {
  BellRing,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  MessageSquare,
  PhoneCall,
  Smartphone,
  Activity,
  Layers,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNotificationStats, useProviderHealth, useSystemAlerts } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';

const trendData = [
  { time: '00:00', email: 2400, sms: 1200, whatsapp: 600, push: 400 },
  { time: '04:00', email: 1800, sms: 800, whatsapp: 450, push: 300 },
  { time: '08:00', email: 6500, sms: 3200, whatsapp: 1800, push: 1200 },
  { time: '12:00', email: 9800, sms: 4500, whatsapp: 2400, push: 1900 },
  { time: '16:00', email: 8200, sms: 3900, whatsapp: 2100, push: 1500 },
  { time: '20:00', email: 4100, sms: 2100, whatsapp: 1100, push: 800 },
];

const channelBreakdown = [
  { name: 'Email', value: 84200, color: '#3b82f6' },
  { name: 'SMS', value: 32100, color: '#10b981' },
  { name: 'WhatsApp', value: 14800, color: '#25d366' },
  { name: 'Push', value: 8750, color: '#8b5cf6' },
];

export function NotificationDashboardView() {
  const { data: stats, isLoading } = useNotificationStats();
  const { data: providers } = useProviderHealth();
  const { data: alerts } = useSystemAlerts();

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-slate-500">Loading Notification Intelligence...</div>;
  }

  const activeAlerts = alerts?.filter((a) => a.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Communication Bus
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Communication Hub & Monitoring</h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time delivery status, queue health, multi-channel dispatch metrics, and provider diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Bus
          </Button>
          <a
            href="/dashboard/notifications/broadcast"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4 mr-2" /> Dispatch Broadcast
          </a>
        </div>
      </div>

      {/* Critical Alerts Banner if active */}
      {activeAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="font-semibold text-amber-700 dark:text-amber-400">
              {activeAlerts.length} Active System Alert(s) Requiring Attention
            </div>
            <div className="text-slate-600 dark:text-zinc-400 text-xs mt-0.5">
              {activeAlerts[0].title}: {activeAlerts[0].message}
            </div>
          </div>
          <a
            href="/dashboard/notifications/alerts"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            View Alert Center &rarr;
          </a>
        </div>
      )}

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Messages</span>
            <BellRing className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            {stats.totalNotifications.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last week
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Delivery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            {stats.deliverySuccessRate}%
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
            {stats.deliveredCount.toLocaleString()} delivered successfully
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            {stats.queueSize}
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
            {stats.pendingCount} pending &bull; {stats.queuedCount} processing
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Failed Delivery</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            {stats.failedCount.toLocaleString()}
          </div>
          <div className="text-xs text-rose-500 mt-2 font-medium">
            0.76% failure rate &bull; 52 dead-letter items
          </div>
        </div>
      </div>

      {/* Channel Volume Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Email Delivered</div>
            <div className="text-xl font-bold text-slate-900 dark:text-zinc-100">{stats.emailDelivered.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">SendGrid / SES</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">SMS Delivered</div>
            <div className="text-xl font-bold text-slate-900 dark:text-zinc-100">{stats.smsDelivered.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Twilio Gateway</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-600 rounded-xl shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">WhatsApp Delivered</div>
            <div className="text-xl font-bold text-slate-900 dark:text-zinc-100">{stats.whatsAppDelivered.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Meta Business API</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Push Delivered</div>
            <div className="text-xl font-bold text-slate-900 dark:text-zinc-100">{stats.pushDelivered.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">FCM / APNs Bus</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">24-Hour Dispatch Trend</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Message throughput across active notification channels</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
              Live Stream
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="email" name="Email" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEmail)" />
                <Area type="monotone" dataKey="sms" name="SMS" stroke="#10b981" fillOpacity={1} fill="url(#colorSms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 mb-1">Channel Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">Percentage volume breakdown by platform</p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    {channelBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
            {channelBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-zinc-400">{item.name}:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Provider Health Overview Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Gateway Provider Health & SLA</h3>
          </div>
          <a
            href="/dashboard/notifications/monitoring"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
          >
            Detailed Diagnostics <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers?.map((p) => (
            <div
              key={p.providerName}
              className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{p.providerName}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    p.status === 'operational'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 flex justify-between">
                <span>99-Day Uptime:</span>
                <span className="font-semibold text-slate-900 dark:text-zinc-100">{p.uptime99}%</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 flex justify-between">
                <span>Avg Latency:</span>
                <span className="font-semibold text-slate-900 dark:text-zinc-100">{p.avgLatencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
