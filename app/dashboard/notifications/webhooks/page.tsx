'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { WebhookManagementView } from '@/features/notifications/components/WebhookManagementView';

export default function WebhookManagementPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-webhooks');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'Webhook Endpoints' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <WebhookManagementView />;
}
