'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationTemplatesView } from '@/features/notifications/components/NotificationTemplatesView';

export default function NotificationTemplatesPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-templates');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Templates Engine' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationTemplatesView />;
}
