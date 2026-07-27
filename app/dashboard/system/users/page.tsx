'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { UserManagementView } from '@/features/system/components/UserManagementView';

export default function UserManagementPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-users');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'User Provisioning' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <UserManagementView />;
}
