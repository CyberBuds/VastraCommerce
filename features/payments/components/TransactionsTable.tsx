
'use client';

import * as React from 'react';
import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useTransactions } from "../hooks/usePayments";
import { columns } from "./TransactionsColumns";
import { Transaction } from '../types';

export const TransactionsTable = () => {
    const { data: transactions, isLoading } = useTransactions();
    const [globalFilter, setGlobalFilter] = React.useState('');

    return (
        <EnterpriseTable<Transaction>
            data={transactions || []}
            columns={columns}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
    );
};
