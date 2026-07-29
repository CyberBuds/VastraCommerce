
'use client';

import * as React from 'react';
import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useCreditNotes } from "../hooks/usePayments";
import { columns } from "./CreditNotesColumns";
import { CreditNote } from "../types";

export const CreditNotesTable = () => {
    const { data: creditNotes, isLoading } = useCreditNotes();
    const [globalFilter, setGlobalFilter] = React.useState('');

    return (
        <EnterpriseTable<CreditNote>
            data={creditNotes || []}
            columns={columns}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
    );
};
