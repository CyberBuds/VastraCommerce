
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { TransactionsTable } from "@/features/payments/components/TransactionsTable";
import { usePermission } from "@/hooks/usePermission";

const TransactionsPage = () => {
    const { hasPermission } = usePermission('Payment.View');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Payment Transactions</h1>
            <TransactionsTable />
        </AdminLayout>
    );
};

export default TransactionsPage;
