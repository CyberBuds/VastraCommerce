'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductsNewRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/products/new');
  }, []);

  return null;
}
