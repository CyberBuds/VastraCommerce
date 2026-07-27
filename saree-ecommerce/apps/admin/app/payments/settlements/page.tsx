
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { usePermission } from "@/hooks/usePermission";

const SettlementsPage = () => {
    const { hasPermission } = usePermission('Finance.Settlement');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Settlements</h1>
        </AdminLayout>
    );
};

export default SettlementsPage;
