
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";

const InvoiceDetailsPage = ({ params }: { params: { id: string } }) => {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Invoice Details</h1>
            <p>Invoice ID: {params.id}</p>
        </AdminLayout>
    );
};

export default InvoiceDetailsPage;
