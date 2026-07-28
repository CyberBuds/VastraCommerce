'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { InAppNotificationView } from '@/features/notifications/components/InAppNotificationView';

export default function InAppNotificationPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-in-app');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'In-App Announcements' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <InAppNotificationView />;
}
