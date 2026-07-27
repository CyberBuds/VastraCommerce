'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { RotateCcw, Trash2, Database, Zap, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

export function CacheManagerView() {
  const { cacheStatus, flushCache } = useSystemStore();

  const handleFlushCategory = (category: any) => {
    flushCache(category);
    toast.success(`Purged cache cluster: ${category}`);
  };

  const handleFlushAll = () => {
    flushCache('ALL');
    toast.success('Purged all Redis & Memory cache keys');
  };

  const totalMemoryKb = cacheStatus.reduce((sum, item) => sum + item.sizeKb, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Enterprise Cache & Memory Invalidation Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Manage Redis & in-memory key stores for catalog queries, session state, route bundles, and tax matrices
          </p>
        </div>
        <Button variant="danger" icon={RotateCcw} onClick={handleFlushAll}>
          Flush All Cache Stores
        </Button>
      </div>

      <Card
        header={
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Active Cache Key Patterns</span>
            <Badge variant="outline" className="font-mono">
              Total footprint: {(totalMemoryKb / 1024).toFixed(2)} MB
            </Badge>
          </div>
        }
      >
        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {cacheStatus.map((c) => (
            <div key={c.key} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">{c.key}</span>
                  <Badge variant="secondary">{c.category}</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {c.itemsCount.toLocaleString()} cached entries &bull; Footprint: {(c.sizeKb / 1024).toFixed(2)} MB
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Last Flushed: {new Date(c.lastFlushedAt).toLocaleString()}
                </p>
              </div>

              <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => handleFlushCategory(c.category)}>
                Flush Key Category
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
