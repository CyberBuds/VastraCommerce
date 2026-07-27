
'use client';

import { EnterpriseTable } from "@/components/enterprise/EnterpriseTable";
import { useDebitNotes } from "../hooks/usePayments";
import { columns } from "./DebitNotesColumns";

export const DebitNotesTable = () => {
    const { data: debitNotes, isLoading } = useDebitNotes();

    return (
        <EnterpriseTable
            data={debitNotes || []}
            columns={columns}
            isLoading={isLoading}
            filterColumn="customer"
        />
    );
};
