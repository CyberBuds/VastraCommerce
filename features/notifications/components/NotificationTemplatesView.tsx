'use client';

import * as React from 'react';
import { FileCode, Plus, Edit, Trash2, CheckCircle2, Eye } from 'lucide-react';
import { useNotificationTemplates } from '../hooks/useNotifications';
import { Button } from '@/components/enterprise/BaseInputs';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { ColumnDef } from '@tanstack/react-table';
import { NotificationTemplate } from '../types/notificationTypes';
import { Modal } from '@/components/enterprise/InteractiveComponents';

export function NotificationTemplatesView() {
  const { data: templates, isLoading } = useNotificationTemplates();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [previewTemplate, setPreviewTemplate] = React.useState<NotificationTemplate | null>(null);

  const columns: ColumnDef<NotificationTemplate, any>[] = [
    {
      accessorKey: 'code',
      header: 'Template Code',
      cell: ({ row }) => (
        <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {row.original.code}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Template Name',
      cell: ({ row }) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{row.original.name}</div>
          <div className="text-xs text-slate-400">{row.original.id} &bull; v{row.original.version}</div>
        </div>
      ),
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => (
        <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
          {row.original.channel}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="capitalize text-xs font-medium text-slate-600 dark:text-zinc-400">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'variables',
      header: 'Variables',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.variables.map((v) => (
            <span key={v} className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 font-mono text-[10px] rounded-md text-slate-600 dark:text-zinc-400">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(row.original)}>
          <Eye className="w-3.5 h-3.5 mr-1" /> Preview
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Notification Templates Engine</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Create, version control, and render dynamic templates with variables across all active channels.
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Create New Template
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <EnterpriseTable
          data={templates || []}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>

      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Template Preview: ${previewTemplate.name}`}
          size="md"
        >
          <div className="space-y-3 text-sm">
            <div className="text-xs font-bold text-slate-500 uppercase">Subject / Header</div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl font-mono text-xs">
              {previewTemplate.subject || '(No Subject)'}
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase">Template Body</div>
            <div className="p-3 bg-slate-100 dark:bg-zinc-950 rounded-xl font-mono text-xs whitespace-pre-wrap">
              {previewTemplate.body}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
