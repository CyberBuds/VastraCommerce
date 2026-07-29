'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductDetailView } from '@/features/catalog/components/ProductDetailView';

export default function ViewProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <ProductDetailView id={id || ''} />;
}
