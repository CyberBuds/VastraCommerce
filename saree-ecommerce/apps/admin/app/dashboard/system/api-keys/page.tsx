'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { ApiIntegrationsView } from '@/features/system/components/ApiIntegrationsView';

export default function ApiIntegrationsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-api-keys');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'API Keys & Webhooks' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <ApiIntegrationsView />;
}
