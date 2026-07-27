
'use client';

import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useRefunds } from "../hooks/usePayments";
import { columns } from "./RefundsColumns";

export const RefundsTable = () => {
    const { data: refunds, isLoading } = useRefunds();

    return (
        <EnterpriseTable
            data={refunds || []}
            columns={columns}
            isLoading={isLoading}
            filterColumn="customer"
        />
    );
};
