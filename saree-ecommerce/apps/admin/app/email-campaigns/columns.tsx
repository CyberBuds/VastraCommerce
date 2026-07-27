// app/email-campaigns/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EmailCampaign } from '@/types/marketing';
import { DataTableColumnHeader, DataTableRowActions } from '@/components/enterprise/EnterpriseTable';
import { Badge, Checkbox } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';

export const columns: ColumnDef<EmailCampaign>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge variant={status === 'SENT' ? 'default' : 'secondary'}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    }
  },
    {
        accessorKey: 'scheduledAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Scheduled At" />,
        cell: ({ row }) => row.original.scheduledAt ? new Date(row.original.scheduledAt).toLocaleString() : 'Not Scheduled',
    },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions>
        <Link href={`/email-campaigns/edit/${row.original.id}`}>Edit</Link>
        {/* Add delete action with confirmation */}
      </DataTableRowActions>
    ),
  },
];
