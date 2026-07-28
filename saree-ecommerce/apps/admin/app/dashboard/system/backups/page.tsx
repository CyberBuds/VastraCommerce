'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { StorageBackupView } from '@/features/system/components/StorageBackupView';

export default function StorageBackupPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-backups');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Disaster Recovery & Backups' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <StorageBackupView />;
}
