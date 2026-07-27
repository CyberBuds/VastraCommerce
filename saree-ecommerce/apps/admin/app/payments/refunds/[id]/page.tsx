
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";

const RefundDetailsPage = ({ params }: { params: { id: string } }) => {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Refund Details</h1>
            <p>Refund ID: {params.id}</p>
        </AdminLayout>
    );
};

export default RefundDetailsPage;
