
'use client';

import * as React from 'react';
import { AdminLayout } from "@/features/layout/AdminLayout";

interface PageProps {
  params: Promise<{ id: string }>;
}

const RefundDetailsPage = ({ params }: PageProps) => {
    const { id } = React.use(params);
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Refund Details</h1>
            <p>Refund ID: {id}</p>
        </AdminLayout>
    );
};

export default RefundDetailsPage;
