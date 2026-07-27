
'use client';

import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useInvoices } from "../hooks/usePayments";
import { columns } from "./InvoicesColumns";

export const InvoicesTable = () => {
    const { data: invoices, isLoading } = useInvoices();

    return (
        <EnterpriseTable
            data={invoices || []}
            columns={columns}
            isLoading={isLoading}
            filterColumn="customer"
        />
    );
};
