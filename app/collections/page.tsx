'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function CollectionsRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/collections');
  }, []);

  return null;
}
