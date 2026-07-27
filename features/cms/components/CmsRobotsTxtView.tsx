'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button } from '@/components/enterprise/BaseInputs';
import { Save, Bot, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function CmsRobotsTxtView() {
  const { robotsConfig, updateRobotsConfig } = useCmsStore();
  const [content, setContent] = React.useState(robotsConfig.rawContent);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRobotsConfig(content);
    toast.success('Robots.txt updated successfully!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Robots.txt & Crawler Permissions"
        description="Configure crawler directives, disallow paths, and sitemap reference files."
        breadcrumbs={[{ label: 'Robots.txt' }]}
      />

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-500" /> Directives Editor
          </h3>
          <span className="text-xs font-mono text-slate-400">/robots.txt</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none leading-relaxed"
        />

        <Button type="submit" className="font-bold gap-2">
          <Save className="w-4 h-4" /> Save Robots.txt Configuration
        </Button>
      </form>
    </div>
  );
}
