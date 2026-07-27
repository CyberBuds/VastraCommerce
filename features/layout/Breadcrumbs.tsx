'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';

export function Breadcrumbs() {
  const { breadcrumbs } = useLayoutStore();

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-slate-850 dark:hover:text-zinc-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-zinc-600" />
            {isLast || !item.href ? (
              <span className="text-slate-900 dark:text-zinc-150 font-bold max-w-[120px] truncate">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-slate-850 dark:hover:text-zinc-200 transition-colors max-w-[120px] truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
