'use client';

import React from 'react';
import { UserRole } from '@/types/auth';
import { Shield, UserCheck, Users, Eye } from 'lucide-react';

interface SocialLoginProps {
  onSelectProfile: (email: string, password: string, role: UserRole) => void;
}

export function SocialLogin({ onSelectProfile }: SocialLoginProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Demo Quick Access Roles
        </span>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
          1-Click Autofill
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectProfile('superadmin@example.com', 'Admin@123', 'SUPER_ADMIN')}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all group flex items-start gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              Super Admin
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              superadmin@example.com
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectProfile('admin@enterprise.com', 'Admin@123', 'ADMIN')}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all group flex items-start gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              Store Manager
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              admin@enterprise.com
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectProfile('manager@enterprise.com', 'Admin@123', 'MANAGER')}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all group flex items-start gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              Sales Lead
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              manager@enterprise.com
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectProfile('operator@enterprise.com', 'Admin@123', 'OPERATOR')}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all group flex items-start gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              Fulfilment Op
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              operator@enterprise.com
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
