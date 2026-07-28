'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { EmailCenterView } from '@/features/notifications/components/EmailCenterView';

export default function EmailCenterPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-email');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Email Center' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <EmailCenterView />;
}
