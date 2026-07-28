'use client';

import * as React from 'react';
import { Activity, Play, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSystemEvents, useSendNotificationMutation } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { SystemEvent } from '../types/notificationTypes';

export function SystemEventsView() {
  const { data: events, isLoading } = useSystemEvents();
  const sendMutation = useSendNotificationMutation();
  const [globalFilter, setGlobalFilter] = React.useState('');

  const handleTestTrigger = (evt: SystemEvent) => {
    sendMutation.mutate({
      title: `Test Trigger: ${evt.eventType}`,
      message: `Simulated event execution for ${evt.description}`,
      recipient: 'admin@enterprise.io',
      channel: evt.triggerChannel[0] || 'email',
    });
  };

  const columns: ColumnDef<SystemEvent, any>[] = [
    {
      accessorKey: 'eventType',
      header: 'Event Identifier',
      cell: ({ row }) => (
        <div>
          <div className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{row.original.eventType}</div>
          <div className="text-xs text-slate-500">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Domain Category',
      cell: ({ row }) => <span className="capitalize font-semibold text-xs text-slate-700 dark:text-zinc-300">{row.original.category}</span>,
    },
    {
      accessorKey: 'triggerChannel',
      header: 'Mapped Channels',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.triggerChannel.map((ch) => (
            <span key={ch} className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-bold text-[10px] uppercase">
              {ch}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'triggeredCount',
      header: 'Trigger Count',
      cell: ({ row }) => <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">{row.original.triggeredCount.toLocaleString()}</span>,
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => handleTestTrigger(row.original)}>
          <Play className="w-3.5 h-3.5 mr-1" /> Test Trigger
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">System Event Bus Map</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Domain application triggers (Order, Payment, Shipment, Customer, Inventory) mapped to notification templates.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={events || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
