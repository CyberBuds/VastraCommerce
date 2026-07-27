
'use client';

import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useWalletTransactions } from "../hooks/usePayments";
import { columns } from "./WalletTransactionsColumns";

export const WalletTransactionsTable = () => {
    const { data: walletTransactions, isLoading } = useWalletTransactions();

    return (
        <EnterpriseTable
            data={walletTransactions || []}
            columns={columns}
            isLoading={isLoading}
            filterColumn="type"
        />
    );
};
