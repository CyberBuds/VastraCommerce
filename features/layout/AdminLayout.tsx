'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useLayoutStore } from '@/store/layoutStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/enterprise/InteractiveComponents';
import { AnimatePresence, motion } from 'motion/react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const {
    isMobileSidebarOpen,
    setMobileSidebar,
    globalLoading,
  } = useLayoutStore();

  const { isAuthenticated, isAuthenticating, checkSession } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  // If not authenticated and done verifying, redirect to login page
  React.useEffect(() => {
    if (!isAuthenticating && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthenticating, router]);

  if (isAuthenticating || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <Spinner className="w-8 h-8" />
        <span className="text-xs font-bold text-slate-500 mt-4 tracking-wider uppercase animate-pulse">
          Authenticating Secure Session...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/50 dark:bg-zinc-950 flex relative overflow-hidden">
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 2. Mobile Sidebar Slide Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-64 h-full bg-white dark:bg-zinc-900 shadow-2xl"
            >
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main content frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>

          {/* Global Loading Overlay */}
          <AnimatePresence>
            {globalLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center"
              >
                <Spinner className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
