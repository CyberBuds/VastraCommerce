'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { ThemeSettingsView } from '@/features/system/components/ThemeSettingsView';

export default function ThemeSettingsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-theme');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Theme & Customization' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <ThemeSettingsView />;
}
