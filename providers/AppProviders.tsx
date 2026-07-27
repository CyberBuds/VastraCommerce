'use client';

import * as React from 'react';
import QueryProvider from './QueryProvider';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/store/themeStore';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  // Synchronize next-theme style on mount
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('ent_theme') || 'system';
    setTheme(storedTheme as any);
  }, [setTheme]);

  return (
    <QueryProvider>
      {children}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'var(--font-sans), sans-serif',
          },
        }}
      />
    </QueryProvider>
  );
}
