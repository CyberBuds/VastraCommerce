
'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "../types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { GatewayBadge } from "./GatewayBadge";

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "transactionDate",
        header: "Transaction Date",
    },
    {
        accessorKey: "orderNumber",
        header: "Order Number",
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "gateway",
        header: "Gateway",
        cell: ({ row }) => <GatewayBadge gateway={row.original.gateway} />,
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: row.original.currency,
            }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
];
