'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductTypesRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/product-types');
  }, []);

  return null;
}
