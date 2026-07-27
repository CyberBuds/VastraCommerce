
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { usePermission } from "@/hooks/usePermission";

const ReconciliationPage = () => {
    const { hasPermission } = usePermission('Finance.Reconciliation');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Reconciliation</h1>
        </AdminLayout>
    );
};

export default ReconciliationPage;
