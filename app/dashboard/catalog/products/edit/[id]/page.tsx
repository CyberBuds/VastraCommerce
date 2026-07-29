'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductWizard } from '@/features/catalog/wizards/ProductWizard';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div className="space-y-4">
      <ProductWizard
        productId={id}
        onCancel={() => router.push('/dashboard/catalog/products')}
        onComplete={() => router.push('/dashboard/catalog/products')}
      />
    </div>
  );
}
