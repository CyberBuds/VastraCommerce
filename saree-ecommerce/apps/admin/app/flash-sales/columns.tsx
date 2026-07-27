// app/flash-sales/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FlashSale } from '@/types/marketing';
import { DataTableColumnHeader, DataTableRowActions } from '@/components/enterprise/EnterpriseTable';
import { Badge, Checkbox } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';

export const columns: ColumnDef<FlashSale>[] = [
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
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start Time" />,
    cell: ({ row }) => new Date(row.original.startTime).toLocaleString(),
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title="End Time" />,
    cell: ({ row }) => new Date(row.original.endTime).toLocaleString(),
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions>
        <Link href={`/flash-sales/edit/${row.original.id}`}>Edit</Link>
        {/* Add delete action with confirmation */}
      </DataTableRowActions>
    ),
  },
];
