'use client';

import * as React from 'react';
import { InvoiceTable } from '@/features/orders/components/InvoiceTable';
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  return (
    <div className="space-y-6" id="invoices-page-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <FileText className="w-5.5 h-5.5" />
            Accounts Receivable: Invoicing Desk
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage tax invoicing ledgers, credit terms, cash collections, billing statements, and export tax printouts.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
        <InvoiceTable />
      </div>
    </div>
  );
}
