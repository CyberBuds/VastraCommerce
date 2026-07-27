
'use client';

import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useTransactions } from "../hooks/usePayments";
import { columns } from "./TransactionsColumns";

export const TransactionsTable = () => {
    const { data: transactions, isLoading } = useTransactions();

    return (
        <EnterpriseTable
            data={transactions || []}
            columns={columns}
            isLoading={isLoading}
            filterColumn="customer"
        />
    );
};
