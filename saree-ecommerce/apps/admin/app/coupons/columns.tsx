// app/coupons/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Coupon } from '@/types/marketing';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/ui/data-table/data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export const columns: ColumnDef<Coupon>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <div className="font-medium">{row.original.code}</div>,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
    cell: ({ row }) => {
        const { type, value } = row.original;
        if (type === 'PERCENTAGE') return `${value}%`;
        if (type === 'FLAT') return `$${value.toFixed(2)}`;
        return 'N/A';
    }
  },
  {
    accessorKey: 'usageCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Usage" />,
    cell: ({ row }) => {
        const { usageCount, maxUsageCount } = row.original;
        return `${usageCount} / ${maxUsageCount ?? '∞'}`;
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge variant={status === 'ACTIVE' ? 'default' : 'destructive'}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
    cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions>
        <Link href={`/coupons/edit/${row.original.id}`}>Edit</Link>
        {/* Add delete action with confirmation */}
      </DataTableRowActions>
    ),
  },
];
