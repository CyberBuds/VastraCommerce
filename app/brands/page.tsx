'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function BrandsRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/brands');
  }, []);

  return null;
}
