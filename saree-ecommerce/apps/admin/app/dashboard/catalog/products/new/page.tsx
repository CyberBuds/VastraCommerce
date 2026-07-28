'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductWizard } from '@/features/catalog/wizards/ProductWizard';

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <ProductWizard
        onCancel={() => router.push('/dashboard/catalog/products')}
        onComplete={() => router.push('/dashboard/catalog/products')}
      />
    </div>
  );
}
