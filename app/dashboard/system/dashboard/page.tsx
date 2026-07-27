'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SystemDashboardView } from '@/features/system/components/SystemDashboardView';

export default function SystemDashboardPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-dashboard');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Dashboard' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SystemDashboardView />;
}
