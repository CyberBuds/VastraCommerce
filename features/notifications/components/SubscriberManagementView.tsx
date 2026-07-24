'use client';

import * as React from 'react';
import { Users, ShieldCheck, Mail, MessageSquare, PhoneCall, Smartphone } from 'lucide-react';
import { useSubscriberPreferences } from '../hooks/useNotifications';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { SubscriberPreference } from '../types/notificationTypes';

export function SubscriberManagementView() {
  const { data: subscribers, isLoading } = useSubscriberPreferences();
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<SubscriberPreference, any>[] = [
    {
      accessorKey: 'userName',
      header: 'Subscriber Name',
      cell: ({ row }) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{row.original.userName}</div>
          <div className="text-xs text-slate-400 font-mono">{row.original.userId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact Address',
      cell: ({ row }) => (
        <div className="text-xs font-mono text-slate-700 dark:text-zinc-300">
          <div>{row.original.email}</div>
          <div className="text-[11px] text-slate-400">{row.original.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: 'channels',
      header: 'Active Opt-In Channels',
      cell: ({ row }) => {
        const c = row.original.channels;
        return (
          <div className="flex items-center gap-1.5 text-xs">
            {c.email && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold">Email</span>}
            {c.sms && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">SMS</span>}
            {c.whatsapp && <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 font-bold">WhatsApp</span>}
            {c.push && <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 font-bold">Push</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Subscription Status',
      cell: ({ row }) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          {row.original.status.replace('_', ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Subscriber Management & Preferences</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          User channel opt-in/opt-out preferences, GDPR compliance consent logs, and frequency caps.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={subscribers || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
