'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SystemHealthView } from '@/features/system/components/SystemHealthView';

export default function SystemHealthPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-health');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Cluster Health Diagnostics' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SystemHealthView />;
}
