'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationInboxView } from '@/features/notifications/components/NotificationInboxView';

export default function NotificationSentPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-sent');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Sent History' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationInboxView folder="sent" />;
}
