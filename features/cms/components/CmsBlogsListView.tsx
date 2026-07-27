'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Button } from '@/components/enterprise/BaseInputs';
import { ColumnDef } from '@tanstack/react-table';
import { BlogPost } from '@/types/cms';
import {
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Tag,
  Folder,
  Eye,
  Heart,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export function CmsBlogsListView() {
  const { blogs, deleteBlog } = useCmsStore();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('ALL');

  const filteredBlogs = React.useMemo(() => {
    if (categoryFilter === 'ALL') return blogs;
    return blogs.filter((b) => b.category === categoryFilter);
  }, [blogs, categoryFilter]);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete blog "${title}"?`)) {
      deleteBlog(id);
      toast.success(`Blog post "${title}" deleted.`);
    }
  };

  const columns = React.useMemo<ColumnDef<BlogPost>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Blog Title & Author',
        cell: ({ row }) => {
          const blog = row.original;
          return (
            <div className="flex items-center gap-3">
              <img src={blog.coverImage} alt={blog.title} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-zinc-800" />
              <div className="flex flex-col gap-0.5">
                <Link
                  href={`/cms/blogs/edit/${blog.id}`}
                  className="font-bold text-slate-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                >
                  {blog.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <span>By <strong className="text-slate-700 dark:text-zinc-300">{blog.author.name}</strong></span>
                  <span>• {blog.readingTimeMinutes} min read</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
            {row.original.category}
          </span>
        ),
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
        accessorKey: 'views',
        header: 'Engagement',
        cell: ({ row }) => (
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {row.original.views.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {row.original.likes}</span>
          </div>
        ),
      },
      {
        accessorKey: 'publishedAt',
        header: 'Published Date',
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            {row.original.publishedAt ? new Date(row.original.publishedAt).toLocaleDateString() : 'Unpublished'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const blog = row.original;
          return (
            <div className="flex items-center gap-1">
              <Link href={`/cms/blogs/edit/${blog.id}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Article">
                  <Edit2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-300" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                onClick={() => handleDelete(blog.id, blog.title)}
                title="Delete Article"
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
        title="Enterprise Corporate Blog & Publications"
        description="Publish industry insights, news, technology whitepapers, and thought leadership articles."
        breadcrumbs={[{ label: 'Blogs' }]}
        actionButton={{
          label: 'Create Blog Post',
          href: '/cms/blogs/new',
        }}
      />

      <EnterpriseTable
        data={filteredBlogs}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
}
