'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { CommunicationGatewaysView } from '@/features/system/components/CommunicationGatewaysView';

export default function CommunicationGatewaysPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-gateways');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Communication Gateways' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <CommunicationGatewaysView />;
}
