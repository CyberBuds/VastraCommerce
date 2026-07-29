
'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "../types";
import { Badge } from "@/components/enterprise/BaseInputs";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "invoiceDate",
        header: "Invoice Date",
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
                        "bg-green-500": status === "paid",
                        "bg-yellow-500": status === "unpaid",
                        "bg-red-500": status === "overdue",
                    })}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
    },
];
