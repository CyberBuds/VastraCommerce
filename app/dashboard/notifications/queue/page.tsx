'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationQueueView } from '@/features/notifications/components/NotificationQueueView';

export default function NotificationQueuePage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-queue');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Dispatch Queue & Retries' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationQueueView />;
}
