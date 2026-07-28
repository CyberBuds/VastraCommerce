'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { LicenseVersionView } from '@/features/system/components/LicenseVersionView';

export default function LicenseVersionPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-license');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Software Build & License' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <LicenseVersionView />;
}
