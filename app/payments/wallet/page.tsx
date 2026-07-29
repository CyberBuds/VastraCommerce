
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { WalletTransactionsTable } from "@/features/payments/components/WalletTransactionsTable";
import { usePermission } from "@/hooks/usePermission";

const WalletPage = () => {
    const { hasPermission } = usePermission('Payment.View');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Wallet Transactions</h1>
            <WalletTransactionsTable />
        </AdminLayout>
    );
};

export default WalletPage;
