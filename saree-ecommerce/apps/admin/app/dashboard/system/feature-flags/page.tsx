'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { FeatureFlagsView } from '@/features/system/components/FeatureFlagsView';

export default function FeatureFlagsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-feature-flags');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Feature Toggles & Flags' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <FeatureFlagsView />;
}
