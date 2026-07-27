import { useEffect, useState } from 'react';
import { useThemeStore, ThemeMode } from '@/store/themeStore';

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Guard against server-side rendering mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Initialize theme state from localStorage if it exists
    const stored = localStorage.getItem('ent_theme') as ThemeMode | null;
    if (stored) {
      setTheme(stored);
    } else {
      setTheme('system');
    }
  }, [setTheme]);

  const activeTheme: 'light' | 'dark' =
    theme === 'system'
      ? typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : (theme as 'light' | 'dark');

  return {
    theme: mounted ? theme : 'system',
    activeTheme: mounted ? activeTheme : 'light',
    setTheme,
    isDark: mounted ? activeTheme === 'dark' : false,
    mounted,
  };
}
