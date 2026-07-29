
'use client';

import * as React from 'react';
import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useDebitNotes } from "../hooks/usePayments";
import { columns } from "./DebitNotesColumns";
import { DebitNote } from '../types';

export const DebitNotesTable = () => {
    const { data: debitNotes, isLoading } = useDebitNotes();
    const [globalFilter, setGlobalFilter] = React.useState('');

    return (
        <EnterpriseTable<DebitNote>
            data={debitNotes || []}
            columns={columns}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
    );
};
