// app/campaigns/components/campaign-table.tsx
'use client';

import * as React from 'react';

import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { useGetCampaigns } from '@/features/marketing/hooks/useCampaigns';
import { columns } from '../columns';

export function CampaignsTable() {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const { data, isLoading } = useGetCampaigns();

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