'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SubscriberManagementView } from '@/features/notifications/components/SubscriberManagementView';

export default function NotificationPreferencesPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-preferences');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Subscriber Preferences' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SubscriberManagementView />;
}
