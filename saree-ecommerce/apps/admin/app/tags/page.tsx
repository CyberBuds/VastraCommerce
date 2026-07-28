'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function TagsRedirect() {
  useEffect(() => {
    redirect('/dashboard/catalog/tags');
  }, []);

  return null;
}
