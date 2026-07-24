'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SystemEventsView } from '@/features/notifications/components/SystemEventsView';

export default function SystemEventsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-events');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'System Event Triggers' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SystemEventsView />;
}
