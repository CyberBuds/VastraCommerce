
'use client';

import { ColumnDef } from "@tanstack/react-table";
import { CreditNote } from "../types";
import { Badge } from "@/components/enterprise/BaseInputs";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<CreditNote, any>[] = [
    {
        accessorKey: "creditNoteDate",
        header: "Date",
    },
    {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
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
                        "bg-green-500": status === "applied",
                        "bg-yellow-500": status === "open",
                        "bg-red-500": status === "void",
                    })}
                >
                    {status}
                </Badge>
            );
        },
    },
];
