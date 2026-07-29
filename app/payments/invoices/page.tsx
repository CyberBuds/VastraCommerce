
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { InvoicesTable } from "@/features/payments/components/InvoicesTable";
import { usePermission } from "@/hooks/usePermission";

const InvoicesPage = () => {
    const { hasPermission } = usePermission('Payment.Invoice');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Invoices</h1>
            <InvoicesTable />
        </AdminLayout>
    );
};

export default InvoicesPage;
