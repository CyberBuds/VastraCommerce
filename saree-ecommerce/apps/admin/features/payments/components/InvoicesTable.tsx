
'use client';

import * as React from 'react';
import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useInvoices } from "../hooks/usePayments";
import { columns } from "./InvoicesColumns";
import { Invoice } from '../types';

export const InvoicesTable = () => {
    const { data: invoices, isLoading } = useInvoices();
    const [globalFilter, setGlobalFilter] = React.useState('');

    return (
        <EnterpriseTable<Invoice>
            data={invoices || []}
            columns={columns}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
    );
};
