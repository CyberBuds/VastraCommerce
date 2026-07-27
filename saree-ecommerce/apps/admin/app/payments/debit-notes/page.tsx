
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { DebitNotesTable } from "@/features/payments/components/DebitNotesTable";
import { usePermission } from "@/hooks/usePermission";

const DebitNotesPage = () => {
    const { hasPermission } = usePermission('Payment.Create');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Debit Notes</h1>
            <DebitNotesTable />
        </AdminLayout>
    );
};

export default DebitNotesPage;
