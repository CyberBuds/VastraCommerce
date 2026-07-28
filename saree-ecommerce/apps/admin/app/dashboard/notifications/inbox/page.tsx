'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationInboxView } from '@/features/notifications/components/NotificationInboxView';

export default function NotificationInboxPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-inbox');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Inbox & Dispatches' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationInboxView folder="inbox" />;
}
