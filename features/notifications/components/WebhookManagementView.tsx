'use client';

import * as React from 'react';
import { Webhook, Plus, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useWebhookEndpoints } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { WebhookEndpoint } from '../types/notificationTypes';

export function WebhookManagementView() {
  const { data: webhooks, isLoading } = useWebhookEndpoints();
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<WebhookEndpoint, any>[] = [
    {
      accessorKey: 'name',
      header: 'Webhook Name / ID',
      cell: ({ row }) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{row.original.name}</div>
          <div className="text-xs text-slate-400 font-mono">{row.original.id}</div>
        </div>
      ),
    },
    {
      accessorKey: 'url',
      header: 'Endpoint URL',
      cell: ({ row }) => <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{row.original.url}</span>,
    },
    {
      accessorKey: 'events',
      header: 'Subscribed Events',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.events.map((evt) => (
            <span key={evt} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-mono text-slate-700 dark:text-zinc-300">
              {evt}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'successRate',
      header: 'Success SLA',
      cell: ({ row }) => <span className="font-bold text-emerald-600 text-xs">{row.original.successRate}%</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Outbound Webhook Subscriptions</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Configure real-time HTTP POST event webhooks, signing secrets, and payload retry inspectors.
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Register Webhook
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={webhooks || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
