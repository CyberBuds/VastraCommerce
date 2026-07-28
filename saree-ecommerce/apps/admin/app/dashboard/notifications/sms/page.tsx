'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SmsCenterView } from '@/features/notifications/components/SmsCenterView';

export default function SmsCenterPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-sms');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'SMS Gateway' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SmsCenterView />;
}
