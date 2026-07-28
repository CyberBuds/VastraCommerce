'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { AuditLogsView } from '@/features/system/components/AuditLogsView';

export default function AuditLogsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-logs');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Security Audit Trail' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <AuditLogsView />;
}
