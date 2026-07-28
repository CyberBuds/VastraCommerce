'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { LocalizationView } from '@/features/system/components/LocalizationView';

export default function LocalizationPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-localization');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Localization & Currencies' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <LocalizationView />;
}
