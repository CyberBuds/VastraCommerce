'use client';

import * as React from 'react';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { AppProviders } from '@/providers/AppProviders';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AdminLayout>{children}</AdminLayout>
    </AppProviders>
  );
}
