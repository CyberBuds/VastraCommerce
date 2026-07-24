'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { PushNotificationView } from '@/features/notifications/components/PushNotificationView';

export default function PushNotificationPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-push');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Push Notifications' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <PushNotificationView />;
}
