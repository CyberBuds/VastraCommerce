// app/abandoned-cart/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AbandonedCart } from '@/types/marketing';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { Checkbox } from '@/components/enterprise/ComplexInputs';
import { DataTableRowActions, DataTableColumnHeader } from '@/components/enterprise/EnterpriseTable';
import { useRecoverAbandonedCart } from '@/features/marketing/hooks/useAbandonedCarts';

const RecoverButton = ({ id }: { id: string }) => {
    const mutation = useRecoverAbandonedCart();
    return <Button size="sm" onClick={() => mutation.mutate(id)} disabled={mutation.isPending}>
        {mutation.isPending ? 'Recovering...' : 'Recover'}
    </Button>
}

export const columns: ColumnDef<AbandonedCart>[] = [
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
    accessorKey: 'customerEmail',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <div>{row.original.customerEmail}</div>,
  },
  {
    accessorKey: 'cartValue',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cart Value" />,
    cell: ({ row }) => `$${row.original.cartValue.toFixed(2)}`,
  },
  {
    accessorKey: 'recoveryStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { recoveryStatus } = row.original;
      return <Badge variant={recoveryStatus === 'RECOVERED' ? 'success' : 'warning'}>{recoveryStatus}</Badge>;
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
        {row.original.recoveryStatus === 'PENDING' && <RecoverButton id={row.original.id} />}
      </DataTableRowActions>
    ),
  },
];
