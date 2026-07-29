
'use client';

import { ColumnDef } from "@tanstack/react-table";
import { WalletTransaction } from "../types";
import { Badge } from "@/components/enterprise/BaseInputs";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<WalletTransaction>[] = [
    {
        accessorKey: "transactionDate",
        header: "Date",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.original.type;
            return (
                <Badge
                    className={cn({
                        "bg-green-500": type === "credit",
                        "bg-red-500": type === "debit",
                        "bg-blue-500": type === "refund",
                        "bg-gray-500": type === "adjustment",
                    })}
                >
                    {type}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => {
            const balance = parseFloat(row.getValue("balance"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(balance);
            return <div>{formatted}</div>;
        },
    },
];
