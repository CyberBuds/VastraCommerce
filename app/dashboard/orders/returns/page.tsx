'use client';

import * as React from 'react';
import { ReturnTable } from '@/features/orders/components/ReturnTable';
import { RefreshCw } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="space-y-6" id="returns-page-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <RefreshCw className="w-5.5 h-5.5" />
            RMA Center: Returns & Refunds
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage return materials authorizations (RMA), inspect defective items, log reasons, and authorize client refunds.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
        <ReturnTable />
      </div>
    </div>
  );
}
