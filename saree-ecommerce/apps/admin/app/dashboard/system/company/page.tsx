'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { CompanyProfileView } from '@/features/system/components/CompanyProfileView';

export default function CompanyProfilePage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();

  React.useEffect(() => {
    setActiveMenuId('system-company');
    setBreadcrumbs([
      { label: 'System Administration', href: '/dashboard/system/dashboard' },
      { label: 'Company Profile' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  return <CompanyProfileView />;
}
