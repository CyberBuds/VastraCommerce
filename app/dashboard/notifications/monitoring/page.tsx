'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { MonitoringView } from '@/features/notifications/components/MonitoringView';

export default function MonitoringPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-monitoring');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Gateway Health & Monitoring' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <MonitoringView />;
}
