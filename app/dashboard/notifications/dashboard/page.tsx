'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationDashboardView } from '@/features/notifications/components/NotificationDashboardView';

export default function NotificationDashboardPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-dashboard');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Executive Dashboard' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationDashboardView />;
}
