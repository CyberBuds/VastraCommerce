'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { BroadcastMessagingView } from '@/features/notifications/components/BroadcastMessagingView';

export default function BroadcastMessagingPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-broadcast');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Broadcast Messaging' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <BroadcastMessagingView />;
}
