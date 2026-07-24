'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SubscriberManagementView } from '@/features/notifications/components/SubscriberManagementView';

export default function SubscriberManagementPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-subscribers');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Subscribers List' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SubscriberManagementView />;
}
