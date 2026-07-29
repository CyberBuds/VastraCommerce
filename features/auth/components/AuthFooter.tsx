'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ShieldCheck } from 'lucide-react';

export function AuthFooter() {
  return (
    <div className="space-y-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Need Help?</span>
          <a
            href="mailto:support@vastracommerce.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            support@vastracommerce.com
          </a>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit SSL</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <span className="text-slate-400 dark:text-slate-600">v2.4.0</span>
        </div>

        <div>
          © {new Date().getFullYear()} VastraCommerce Inc.
        </div>
      </div>
    </div>
  );
}
