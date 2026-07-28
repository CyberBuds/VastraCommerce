'use client';

import * as React from 'react';
import { Layers, RefreshCw, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useNotificationQueue, useRetryQueueMutation } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { QueueItem } from '../types/notificationTypes';

export function NotificationQueueView() {
  const { data: queue, isLoading } = useNotificationQueue();
  const retryMutation = useRetryQueueMutation();
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<QueueItem, any>[] = [
    {
      accessorKey: 'id',
      header: 'Queue ID',
      cell: ({ row }) => <span className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300">{row.original.id}</span>,
    },
    {
      accessorKey: 'payloadSummary',
      header: 'Message Summary',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-xs font-semibold text-slate-900 dark:text-zinc-100">
          {row.original.payloadSummary}
        </div>
      ),
    },
    {
      accessorKey: 'queueType',
      header: 'Queue State',
      cell: ({ row }) => {
        const type = row.original.queueType;
        const color =
          type === 'pending'
            ? 'bg-amber-500/10 text-amber-600'
            : type === 'retry'
            ? 'bg-blue-500/10 text-blue-600'
            : 'bg-rose-500/10 text-rose-600';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${color}`}>{type.replace('_', ' ')}</span>;
      },
    },
    {
      accessorKey: 'retryCount',
      header: 'Retry Progress',
      cell: ({ row }) => (
        <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
          {row.original.retryCount} / {row.original.maxRetries}
        </span>
      ),
    },
    {
      accessorKey: 'lastError',
      header: 'Last Error / Latency',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-xs font-mono text-rose-500">
          {row.original.lastError || 'None'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          isLoading={retryMutation.isPending}
          onClick={() => retryMutation.mutate(row.original.id)}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Now
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Notification Queue & Dead Letter Queue</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Monitor active pending queue items, exponential retry policies, and dead letter queue inspections.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={queue || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
