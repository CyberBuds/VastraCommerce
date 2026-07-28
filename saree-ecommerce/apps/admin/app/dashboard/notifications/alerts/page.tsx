'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { AlertCenterView } from '@/features/notifications/components/AlertCenterView';

export default function AlertCenterPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-alerts');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'System Alert Center' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <AlertCenterView />;
}
