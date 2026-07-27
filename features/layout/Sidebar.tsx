'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { SIDEBAR_MENU, MenuItem } from '@/config/menu';
import { useLayoutStore } from '@/store/layoutStore';
import { useSettingsStore } from '@/store/settingsStore';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';
import { ChevronDown, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Dynamic Icon translation helper
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
};

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebarCollapse } = useLayoutStore();
  const { settings } = useSettingsStore();
  const { hasPermission } = usePermission();

  // Track expanded menu folders in a dictionary map
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Pre-expand folders that contain currently active path segments
  React.useEffect(() => {
    const expandActiveFolders = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) => child.href === pathname);
          if (hasActiveChild) {
            setExpandedFolders((prev) => ({ ...prev, [item.id]: true }));
          }
          expandActiveFolders(item.children);
        }
      });
    };
    expandActiveFolders(SIDEBAR_MENU);
  }, [pathname]);

  const renderMenuItem = (item: MenuItem, level = 0) => {
    // 1. Evaluate permissions
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    const hasChildren = !!item.children && item.children.length > 0;
    const isExpanded = !!expandedFolders[item.id];
    const isActive = item.href ? pathname === item.href : false;

    // Check if any subchild is active for parent highlighting
    const isParentActive = hasChildren
      ? item.children!.some((child) => child.href === pathname)
      : false;

    const baseItemStyles = cn(
      'w-full flex items-center justify-between py-2 px-3.5 rounded-lg text-sm font-semibold transition-all group cursor-pointer relative',
      {
        'text-slate-500 dark:text-zinc-400 hover:bg-slate-100/60 dark:hover:bg-zinc-850/45 hover:text-slate-800 dark:hover:text-zinc-200': !isActive && !isParentActive,
        'bg-slate-900 text-white dark:bg-brand dark:text-white shadow-md shadow-slate-950/20 dark:shadow-brand/20': isActive,
        'text-slate-800 bg-slate-50 dark:text-zinc-200 dark:bg-zinc-850/20': isParentActive && !isSidebarCollapsed,
      }
    );

    if (hasChildren) {
      return (
        <div key={item.id} className="flex flex-col gap-1 w-full">
          {isSidebarCollapsed ? (
            // Collapsed: Simple Hover tooltip style or compact view
            <button
              onClick={toggleSidebarCollapse}
              className={cn(
                'flex justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800',
                { 'text-slate-900 bg-slate-100 dark:bg-zinc-800 dark:text-white': isParentActive }
              )}
              title={item.title}
            >
              <DynamicIcon name={item.icon} className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button onClick={() => toggleFolder(item.id)} className={baseItemStyles}>
                <div className="flex items-center gap-3">
                  <DynamicIcon name={item.icon} className="w-4.5 h-4.5" />
                  <span>{item.title}</span>
                </div>
                <ChevronDown
                  className={cn('w-4 h-4 text-slate-400 transition-transform duration-250', {
                    'rotate-180': isExpanded,
                  })}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden flex flex-col gap-1 pl-6 border-l border-slate-200/60 dark:border-zinc-800/60 ml-5 mt-1"
                  >
                    {item.children!.map((child) => renderMenuItem(child, level + 1))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      );
    }

    return (
      <Link key={item.id} href={item.href || '#'} className={baseItemStyles}>
        <div className="flex items-center gap-3 w-full">
          <DynamicIcon name={item.icon} className={cn('w-4.5 h-4.5', isSidebarCollapsed ? 'mx-auto' : '')} />
          {!isSidebarCollapsed && <span className="truncate">{item.title}</span>}
        </div>
        {isActive && !isSidebarCollapsed && (
          <motion.div
            layoutId="activeSideIndicator"
            className="absolute right-1.5 w-1 h-4 bg-slate-900/40 dark:bg-brand rounded-full"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'h-screen bg-slate-50 dark:bg-zinc-950 border-r border-slate-200/80 dark:border-zinc-850 flex flex-col transition-all duration-300 z-50 sticky top-0 shrink-0',
        {
          'w-64': !isSidebarCollapsed,
          'w-20': isSidebarCollapsed,
        }
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/60 dark:border-zinc-850 justify-between">
        {!isSidebarCollapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-slate-900 text-white dark:bg-brand dark:text-white flex items-center justify-center shadow-sm dark:shadow-brand/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <span className="font-bold text-base text-slate-900 dark:text-zinc-100 tracking-tight">
              {settings.appName}
            </span>
          </Link>
        ) : (
          <span className="mx-auto p-1.5 rounded-lg bg-slate-900 text-white dark:bg-brand dark:text-white flex items-center justify-center shadow-sm dark:shadow-brand/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </span>
        )}
      </div>

      {/* Menu Area */}
      <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1 scrollbar-none">
        {SIDEBAR_MENU.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-slate-200/60 dark:border-zinc-850">
        {!isSidebarCollapsed ? (
          <div className="bg-white dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-150 dark:border-zinc-850">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
              Deployment Node
            </p>
            <p className="text-xs font-bold text-slate-800 dark:text-zinc-350 mt-1 truncate">
              prod-instance-v1.0
            </p>
          </div>
        ) : (
          <div className="w-full text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500">
            V1
          </div>
        )}
      </div>
    </aside>
  );
}
