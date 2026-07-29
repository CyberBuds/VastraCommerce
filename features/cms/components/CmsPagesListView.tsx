'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Button } from '@/components/enterprise/BaseInputs';
import { ColumnDef } from '@tanstack/react-table';
import { CmsPage } from '@/types/cms';
import {
  FileText,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Lock,
  Globe,
  MoreHorizontal,
  Copy,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

export function CmsPagesListView() {
  const { pages, deletePage, bulkPublishPages, bulkUnpublishPages, bulkDeletePages } = useCmsStore();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusTab, setStatusTab] = React.useState<string>('ALL');

  const filteredPages = React.useMemo(() => {
    if (statusTab === 'ALL') return pages;
    return pages.filter((p) => p.status === statusTab);
  }, [pages, statusTab]);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePage(id);
      toast.success(`Page "${title}" removed successfully.`);
    }
  };

  const columns = React.useMemo<ColumnDef<CmsPage>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded-md border-slate-300 dark:border-zinc-700"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded-md border-slate-300 dark:border-zinc-700"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'title',
        header: 'Page Title & Slug',
        cell: ({ row }) => {
          const page = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <Link
                href={`/cms/pages/edit/${page.id}`}
                className="font-bold text-slate-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {page.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                <span>/{page.slug}</span>
                {page.summary && <span className="text-[11px] text-slate-400 truncate max-w-xs">• {page.summary}</span>}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'pageTemplate',
        header: 'Template',
        cell: ({ row }) => {
          const tmpl = row.original.pageTemplate;
          return (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
              {tmpl}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let color = 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300';
          if (status === 'PUBLISHED') color = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
          if (status === 'DRAFT') color = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
          if (status === 'SCHEDULED') color = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';

          return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${color}`}>
              {status === 'PUBLISHED' && <CheckCircle className="w-3.5 h-3.5" />}
              {status === 'SCHEDULED' && <Clock className="w-3.5 h-3.5" />}
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'visibility',
        header: 'Visibility',
        cell: ({ row }) => {
          const vis = row.original.visibility;
          return (
            <span className="text-xs text-slate-600 dark:text-zinc-300 flex items-center gap-1 font-medium">
              {vis === 'PUBLIC' ? <Globe className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
              {vis}
            </span>
          );
        },
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
            {row.original.views.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-zinc-400">{row.original.author.name}</span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Modified',
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const page = row.original;
          return (
            <div className="flex items-center gap-1">
              <Link href={`/cms/pages/edit/${page.id}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Page">
                  <Edit2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-300" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                onClick={() => handleDelete(page.id, page.title)}
                title="Delete Page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <CmsHeader
        title="CMS Pages Directory"
        description="Create, publish, template, and manage corporate static and dynamic web pages."
        breadcrumbs={[{ label: 'Pages' }]}
        actionButton={{
          label: 'Create New Page',
          href: '/cms/pages/new',
        }}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        {['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusTab === tab
                ? 'bg-slate-900 text-white dark:bg-brand dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Enterprise Data Table */}
      <EnterpriseTable
        data={filteredPages}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onBulkDelete={(rows) => {
          const ids = rows.map((r) => r.id);
          bulkDeletePages(ids);
          toast.success(`Deleted ${ids.length} selected pages.`);
        }}
        onBulkStatusChange={(rows, status) => {
          const ids = rows.map((r) => r.id);
          if (status === 'PUBLISHED') bulkPublishPages(ids);
          if (status === 'DRAFT') bulkUnpublishPages(ids);
          toast.success(`Updated status for ${ids.length} pages.`);
        }}
      />
    </div>
  );
}
