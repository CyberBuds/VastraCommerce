'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { SecurityPolicyView } from '@/features/system/components/SecurityPolicyView';

export default function SecurityPolicyPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-security');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Security & Auth Policy' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <SecurityPolicyView />;
}
