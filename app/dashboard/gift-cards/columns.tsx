// app/gift-cards/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { GiftCard } from '@/types/marketing';
import { DataTableColumnHeader, DataTableRowActions } from '@/components/enterprise/EnterpriseTable';
import { Badge, Checkbox } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';

export const columns: ColumnDef<GiftCard>[] = [
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
    accessorKey: 'initialAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Initial Amount" />,
    cell: ({ row }) => `$${row.original.initialAmount.toFixed(2)}`,
  },
    {
        accessorKey: 'balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
        cell: ({ row }) => `$${row.original.balance.toFixed(2)}`,
    },
    {
        accessorKey: 'recipientEmail',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Recipient" />,
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
        accessorKey: 'expiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expiry Date" />,
        cell: ({ row }) => new Date(row.original.expiryDate).toLocaleDateString(),
    },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions>
        <Link href={`/gift-cards/${row.original.id}`}>View</Link>
        {/* Add delete action with confirmation */}
      </DataTableRowActions>
    ),
  },
];
