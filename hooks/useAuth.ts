import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, isAuthenticated, isAuthenticating, login, logout, checkSession } = useAuthStore();
  const { settings } = useSettingsStore();
  const router = useRouter();

  // Initialize session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Automated Idle Timeout and Auto-Logout Tracker
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutMinutes = settings.autoLogoutMinutes || 30;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        console.warn('Auto logout due to inactivity.');
        logout();
        router.push('/login?reason=inactive');
      }, timeoutMs);
    };

    // Listen to user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, logout, settings.autoLogoutMinutes, router]);

  return {
    user,
    isAuthenticated,
    isAuthenticating,
    login,
    logout,
  };
}
