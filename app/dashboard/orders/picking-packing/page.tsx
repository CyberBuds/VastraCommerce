'use client';

import * as React from 'react';
import { PickingPackingQueue } from '@/features/orders/components/PickingPackingQueue';
import { Boxes } from 'lucide-react';

export default function PickingPackingPage() {
  return (
    <div className="space-y-6" id="picking-packing-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Boxes className="w-5.5 h-5.5" />
            Warehouse Picking & Packing Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage physical stock bin extractions, scan items, resolve inventory shortages, and verify heavy box packing.
          </p>
        </div>
      </div>

      <PickingPackingQueue />
    </div>
  );
}
