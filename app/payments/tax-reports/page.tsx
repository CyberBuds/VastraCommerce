
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { usePermission } from "@/hooks/usePermission";

const TaxReportsPage = () => {
    const { hasPermission } = usePermission('Finance.Report');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Tax Reports</h1>
        </AdminLayout>
    );
};

export default TaxReportsPage;
