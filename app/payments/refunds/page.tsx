
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { RefundsTable } from "@/features/payments/components/RefundsTable";
import { usePermission } from "@/hooks/usePermission";

const RefundsPage = () => {
    const { hasPermission } = usePermission('Payment.Refund');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Refunds</h1>
            <RefundsTable />
        </AdminLayout>
    );
};

export default RefundsPage;
