'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AttributesRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/attributes');
  }, []);

  return null;
}
