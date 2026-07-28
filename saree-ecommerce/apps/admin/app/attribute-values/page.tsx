'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AttributeValuesRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/attribute-values');
  }, []);

  return null;
}
