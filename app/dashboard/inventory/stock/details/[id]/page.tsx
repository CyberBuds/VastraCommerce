'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { StockDetailView } from '@/features/inventory/components/StockDetailView';

export default function StockDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return <StockDetailView id={id || ''} />;
}
