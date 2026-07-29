'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { WarehouseFormView } from '@/features/inventory/components/WarehouseFormView';

export default function RootEditWarehousePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return <WarehouseFormView id={id} />;
}
