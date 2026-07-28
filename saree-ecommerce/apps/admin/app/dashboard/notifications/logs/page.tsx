'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationLogsView } from '@/features/notifications/components/NotificationLogsView';

export default function NotificationLogsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-logs');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Audit Logs & Responses' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationLogsView />;
}
