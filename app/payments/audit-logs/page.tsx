
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { usePermission } from "@/hooks/usePermission";

const AuditLogsPage = () => {
    const { hasPermission } = usePermission('Payment.View');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
        </AdminLayout>
    );
};

export default AuditLogsPage;
