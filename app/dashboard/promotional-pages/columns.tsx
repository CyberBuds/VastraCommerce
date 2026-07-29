// app/promotional-pages/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PromotionalPage } from '@/types/marketing';
import { DataTableColumnHeader, DataTableRowActions } from '@/components/enterprise/EnterpriseTable';
import { Badge, Checkbox } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';

export const columns: ColumnDef<PromotionalPage>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge variant={status === 'PUBLISHED' ? 'default' : 'secondary'}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    }
  },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions>
        <Link href={`/promotional-pages/edit/${row.original.id}`}>Edit</Link>
        {/* Add delete action with confirmation */}
      </DataTableRowActions>
    ),
  },
];
