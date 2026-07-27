
'use client';

import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useCreditNotes } from "../hooks/usePayments";
import { columns } from "./CreditNotesColumns";

export const CreditNotesTable = () => {
    const { data: creditNotes, isLoading } = useCreditNotes();

    return (
        <EnterpriseTable
            data={creditNotes || []}
            columns={columns}
            isLoading={isLoading}
            filterColumn="customer"
        />
    );
};
