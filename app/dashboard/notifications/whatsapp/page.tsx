'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { WhatsAppCenterView } from '@/features/notifications/components/WhatsAppCenterView';

export default function WhatsAppCenterPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('notifications-whatsapp');
    setBreadcrumbs([
      { label: 'Notification Center', href: '/dashboard/notifications/dashboard' },
      { label: 'WhatsApp Business API' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <WhatsAppCenterView />;
}
