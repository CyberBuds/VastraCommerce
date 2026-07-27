'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLayoutStore } from '@/store/layoutStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useTheme } from '@/hooks/useTheme';
import { Breadcrumbs } from './Breadcrumbs';
import { Menu, Bell, Sun, Moon, LogOut, Settings, ShieldAlert, Check, Trash2 } from 'lucide-react';
import { Avatar, Badge, Button } from '@/components/enterprise/BaseInputs';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const { toggleMobileSidebar, isSidebarCollapsed, toggleSidebarCollapse } = useLayoutStore();
  const { user, logout } = useAuthStore();
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const { isDark, setTheme } = useTheme();
  const router = useRouter();

  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const unreadCount = getUnreadCount();

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-zinc-850 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left side: Hamburger and breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:outline-none"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <button
          onClick={toggleSidebarCollapse}
          className="hidden lg:block p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-650" />
          )}
        </Button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-9 h-9 relative"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden flex flex-col"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Notifications</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
                    >
                      Read All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={clearAll}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-850">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                      No new alerts
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3.5 flex gap-2.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-850/30 ${
                          !notif.read ? 'bg-slate-50/50 dark:bg-zinc-950/20' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {notif.type === 'warning' ? (
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Bell className="w-4 h-4 text-sky-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate">{notif.title}</p>
                          <p className="text-[10px] text-slate-450 dark:text-zinc-450 mt-0.5 leading-normal">{notif.description}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
          >
            <Avatar src={user?.avatarUrl} name={user ? `${user.firstName} ${user.lastName}` : 'N A'} size="sm" />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-tight group-hover:text-slate-900 transition-colors">
                {user ? `${user.firstName} ${user.lastName}` : 'Anonymous'}
              </span>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-zinc-550 leading-none mt-0.5">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden flex flex-col text-xs text-slate-700 dark:text-zinc-300 font-medium"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-850 flex flex-col gap-1">
                  <p className="font-bold text-slate-850 dark:text-zinc-150">
                    {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                  </p>
                  <p className="text-[10px] text-slate-450 dark:text-zinc-500 truncate">{user?.email}</p>
                  <Badge variant="brand" className="w-fit mt-1.5 px-2 py-0">
                    {user?.role}
                  </Badge>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push('/dashboard/settings/general');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-450" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors text-left border-t border-slate-100 dark:border-zinc-850"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
