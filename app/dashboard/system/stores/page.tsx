'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { StoreSettingsView } from '@/features/system/components/StoreSettingsView';

export default function StoreSettingsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-stores');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Multi-Store Channels' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <StoreSettingsView />;
}
