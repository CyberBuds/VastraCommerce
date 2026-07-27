'use client';

import * as React from 'react';

import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { useGetWhatsAppCampaigns } from '@/features/marketing/hooks/useWhatsAppCampaigns';
import { columns } from '../columns';

export function WhatsAppCampaignsTable() {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const { data, isLoading } = useGetWhatsAppCampaigns({
    // filters here
  });

  const tableData = data?.data ?? [];

  return (
    <EnterpriseTable
      data={tableData}
      columns={columns}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      isLoading={isLoading}
    />
  );
}