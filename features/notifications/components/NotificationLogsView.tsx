'use client';

import * as React from 'react';
import { FileText, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNotificationLogs } from '../hooks/useNotifications';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { NotificationLog } from '../types/notificationTypes';

export function NotificationLogsView() {
  const { data: logs, isLoading } = useNotificationLogs();
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<NotificationLog, any>[] = [
    {
      accessorKey: 'id',
      header: 'Log ID',
      cell: ({ row }) => <span className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300">{row.original.id}</span>,
    },
    {
      accessorKey: 'provider',
      header: 'Gateway Provider',
      cell: ({ row }) => <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{row.original.provider}</span>,
    },
    {
      accessorKey: 'recipient',
      header: 'Recipient',
      cell: ({ row }) => <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">{row.original.recipient}</span>,
    },
    {
      accessorKey: 'providerResponseCode',
      header: 'HTTP Response Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200">
          {row.original.providerResponseCode}
        </span>
      ),
    },
    {
      accessorKey: 'latencyMs',
      header: 'Latency',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-500">{row.original.latencyMs} ms</span>,
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-400">{row.original.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Audit Logs & Response Payloads</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Complete historical trace of outbound gateway API requests, raw response bodies, and latency tracking.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={logs || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
