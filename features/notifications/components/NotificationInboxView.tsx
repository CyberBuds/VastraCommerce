'use client';

import * as React from 'react';
import {
  Inbox,
  Send,
  Star,
  Pin,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Mail,
  MessageSquare,
  PhoneCall,
  Smartphone,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useNotificationsList, useSendNotificationMutation } from '../hooks/useNotifications';
import { Button, Input } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { NotificationItem } from '../types/notificationTypes';
import { Modal } from '@/components/enterprise/InteractiveComponents';

export function NotificationInboxView({ folder = 'inbox' }: { folder?: string }) {
  const { data: notifications, isLoading, refetch } = useNotificationsList(folder);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<NotificationItem | null>(null);

  const channelIcons: Record<string, React.ReactNode> = {
    email: <Mail className="w-4 h-4 text-blue-500" />,
    sms: <MessageSquare className="w-4 h-4 text-emerald-500" />,
    whatsapp: <PhoneCall className="w-4 h-4 text-green-500" />,
    push: <Smartphone className="w-4 h-4 text-purple-500" />,
    'in-app': <Inbox className="w-4 h-4 text-indigo-500" />,
  };

  const columns: ColumnDef<NotificationItem, any>[] = [
    {
      accessorKey: 'id',
      header: 'ID / Code',
      cell: ({ row }) => (
        <div className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300">
          {row.original.id}
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Subject / Title',
      cell: ({ row }) => (
        <div className="max-w-md">
          <div className="font-semibold text-slate-900 dark:text-zinc-100 text-sm flex items-center gap-2">
            {row.original.isPinned && <Pin className="w-3.5 h-3.5 text-indigo-500 shrink-0 fill-indigo-500" />}
            <span className="truncate">{row.original.title}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">{row.original.message}</div>
        </div>
      ),
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 capitalize text-xs font-medium text-slate-700 dark:text-zinc-300">
          {channelIcons[row.original.channel] || <Mail className="w-4 h-4" />}
          <span>{row.original.channel}</span>
        </div>
      ),
    },
    {
      accessorKey: 'recipient',
      header: 'Recipient',
      cell: ({ row }) => (
        <div className="text-xs font-medium text-slate-800 dark:text-zinc-200">
          {row.original.recipientName ? (
            <div>
              <div className="font-semibold">{row.original.recipientName}</div>
              <div className="text-[11px] text-slate-400">{row.original.recipient}</div>
            </div>
          ) : (
            row.original.recipient
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const colorMap: Record<string, string> = {
          delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          sent: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          failed: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
              colorMap[status] || 'bg-slate-100 text-slate-600'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'sentAt',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
          {row.original.sentAt || 'N/A'}
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
          onClick={() => setSelectedItem(row.original)}
          className="text-xs"
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Folder Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 capitalize">
            Notification Center - {folder}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Browse, inspect, and manage active system dispatches across all active channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={notifications || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Message Details (${selectedItem.id})`}
          size="lg"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-850 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Subject</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{selectedItem.title}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Channel & Priority</span>
                <span className="font-medium text-slate-800 dark:text-zinc-200 uppercase">
                  {selectedItem.channel} ({selectedItem.priority})
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Recipient</span>
                <span className="font-medium text-slate-800 dark:text-zinc-200">{selectedItem.recipient}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Status</span>
                <span className="font-semibold text-emerald-600 capitalize">{selectedItem.status}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-zinc-950 rounded-xl font-mono text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap">
              {selectedItem.message}
            </div>

            {selectedItem.failureReason && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 rounded-xl text-xs font-mono">
                <strong>Failure Log:</strong> {selectedItem.failureReason}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
