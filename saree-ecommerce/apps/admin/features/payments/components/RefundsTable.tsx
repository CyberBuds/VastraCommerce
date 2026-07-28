
'use client';

import * as React from 'react';
import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useRefunds } from "../hooks/usePayments";
import { columns } from "./RefundsColumns";
import { Refund } from '../types';

export const RefundsTable = () => {
    const { data: refunds, isLoading } = useRefunds();
    const [globalFilter, setGlobalFilter] = React.useState('');

    return (
        <EnterpriseTable<Refund>
            data={refunds || []}
            columns={columns}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
    );
};
