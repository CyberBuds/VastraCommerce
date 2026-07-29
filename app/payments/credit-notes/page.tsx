
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { CreditNotesTable } from "@/features/payments/components/CreditNotesTable";
import { usePermission } from "@/hooks/usePermission";

const CreditNotesPage = () => {
    const { hasPermission } = usePermission('Payment.Create');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Credit Notes</h1>
            <CreditNotesTable />
        </AdminLayout>
    );
};

export default CreditNotesPage;
