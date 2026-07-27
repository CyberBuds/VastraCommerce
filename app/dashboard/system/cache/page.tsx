'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { CacheManagerView } from '@/features/system/components/CacheManagerView';

export default function CacheManagerPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-cache');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Cache & Memory Invalidation' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <CacheManagerView />;
}
