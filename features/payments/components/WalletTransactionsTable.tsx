
'use client';

import * as React from 'react';
import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useWalletTransactions } from "../hooks/usePayments";
import { columns } from "./WalletTransactionsColumns";
import { WalletTransaction } from '../types';

export const WalletTransactionsTable = () => {
    const { data: walletTransactions, isLoading } = useWalletTransactions();
    const [globalFilter, setGlobalFilter] = React.useState('');

    return (
        <EnterpriseTable<WalletTransaction>
            data={walletTransactions || []}
            columns={columns}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
    );
};
