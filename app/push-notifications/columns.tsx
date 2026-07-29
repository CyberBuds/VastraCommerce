// app/push-notifications/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PushNotification } from '@/types/marketing';
import { DataTableColumnHeader, DataTableRowActions } from '@/components/enterprise/EnterpriseTable';
import { Badge, Checkbox } from '@/components/enterprise/BaseInputs';

export const columns: ColumnDef<PushNotification>[] = [
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
    accessorKey: 'body',
    header: 'Body',
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
        accessorKey: 'priority',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions>
        {/* Add delete action with confirmation */}
      </DataTableRowActions>
    ),
  },
];
