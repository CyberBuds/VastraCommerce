'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductsRedirectPage() {
  useEffect(() => {
    redirect('/dashboard/catalog/products');
  }, []);

  return null;
}
