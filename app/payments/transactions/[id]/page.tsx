
'use client';

import * as React from 'react';
import { AdminLayout } from "@/features/layout/AdminLayout";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TransactionDetailsPage = ({ params }: PageProps) => {
    const { id } = React.use(params);
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Payment Transaction Details</h1>
            <p>Transaction ID: {id}</p>
        </AdminLayout>
    );
};

export default TransactionDetailsPage;
