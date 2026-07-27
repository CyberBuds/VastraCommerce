'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { TaxSettingsView } from '@/features/system/components/TaxSettingsView';

export default function TaxSettingsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-tax');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Tax & Compliance' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <TaxSettingsView />;
}
