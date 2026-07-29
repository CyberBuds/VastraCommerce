
'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Refund } from "../types";
import { Badge } from "@/components/enterprise/BaseInputs";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Refund>[] = [
    {
        accessorKey: "refundDate",
        header: "Date",
    },
    {
        accessorKey: "transactionId",
        header: "Transaction ID",
    },
    {
        accessorKey: "customer",
        header: "Customer",
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    className={cn({
                        "bg-green-500": status === "approved" || status === "processed",
                        "bg-yellow-500": status === "pending",
                        "bg-red-500": status === "rejected",
                    })}
                >
                    {status}
                </Badge>
            );
        },
    },
];
