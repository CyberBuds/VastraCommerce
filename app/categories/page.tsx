'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function CategoriesRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/categories');
  }, []);

  return null;
}
