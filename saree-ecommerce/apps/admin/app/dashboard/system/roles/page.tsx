'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { RolesPermissionsView } from '@/features/system/components/RolesPermissionsView';

export default function RolesPermissionsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-roles');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Roles & Permissions' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <RolesPermissionsView />;
}
