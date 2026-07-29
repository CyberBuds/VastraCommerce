'use client';

import { useParams, redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductsViewRedirect() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      redirect(`/dashboard/catalog/products/view/${id}`);
    }
  }, [id]);

  return null;
}
