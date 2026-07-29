'use client';

import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

export function AuthHeader() {
  return (
    <div className="space-y-4">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-black/5">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            VastraCommerce
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
            <Sparkles className="w-2.5 h-2.5" />
            Admin
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Welcome back 👋
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Sign in to manage your business from one unified dashboard.
        </p>
      </div>
    </div>
  );
}
