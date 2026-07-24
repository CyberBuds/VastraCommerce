'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { NotificationCampaignsView } from '@/features/notifications/components/NotificationCampaignsView';

export default function NotificationCampaignsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-campaigns');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Communication Campaigns' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <NotificationCampaignsView />;
}
