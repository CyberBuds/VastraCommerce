
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";

const TransactionDetailsPage = ({ params }: { params: { id: string } }) => {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Payment Transaction Details</h1>
            <p>Transaction ID: {params.id}</p>
        </AdminLayout>
    );
};

export default TransactionDetailsPage;
