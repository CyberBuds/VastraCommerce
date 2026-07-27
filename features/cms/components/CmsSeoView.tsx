'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Label } from '@/components/enterprise/BaseInputs';
import { ShieldCheck, Save, Globe, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function CmsSeoView() {
  const { seoConfig, updateSeoConfig } = useCmsStore();

  const [siteName, setSiteName] = React.useState(seoConfig.siteName);
  const [titleTemplate, setTitleTemplate] = React.useState(seoConfig.titleTemplate);
  const [defaultMetaDescription, setDefaultMetaDescription] = React.useState(seoConfig.defaultMetaDescription);
  const [defaultOgImage, setDefaultOgImage] = React.useState(seoConfig.defaultOgImage);
  const [twitterHandle, setTwitterHandle] = React.useState(seoConfig.twitterHandle);
  const [googleSiteVerification, setGoogleSiteVerification] = React.useState(seoConfig.googleSiteVerification);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoConfig({
      siteName,
      titleTemplate,
      defaultMetaDescription,
      defaultOgImage,
      twitterHandle,
      googleSiteVerification,
    });
    toast.success('SEO Global Configuration updated!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="SEO & Search Engine Intelligence"
        description="Global search engine optimization settings, OpenGraph social cards, and crawlability rules."
        breadcrumbs={[{ label: 'SEO Settings' }]}
      />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" /> Site Identity & Metadata
          </h3>

          <div>
            <Label htmlFor="siteName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Brand / Site Name</Label>
            <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1 text-xs font-bold" />
          </div>

          <div>
            <Label htmlFor="titleTemplate" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Title Tag Template</Label>
            <Input id="titleTemplate" value={titleTemplate} onChange={(e) => setTitleTemplate(e.target.value)} className="mt-1 text-xs font-mono" />
            <p className="text-[10px] text-slate-400 mt-1">Use %s for the individual page title placeholder.</p>
          </div>

          <div>
            <Label htmlFor="defaultMetaDescription" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Fallback Meta Description</Label>
            <textarea
              id="defaultMetaDescription"
              value={defaultMetaDescription}
              onChange={(e) => setDefaultMetaDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>

          <div>
            <Label htmlFor="defaultOgImage" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Default Social Share Image (OpenGraph URL)</Label>
            <Input id="defaultOgImage" value={defaultOgImage} onChange={(e) => setDefaultOgImage(e.target.value)} className="mt-1 text-xs font-mono" />
          </div>

          <Button type="submit" className="font-bold gap-2">
            <Save className="w-4 h-4" /> Save Global SEO Rules
          </Button>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> Search Console & Social
          </h3>

          <div>
            <Label htmlFor="twitterHandle" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Twitter / X Handle</Label>
            <Input id="twitterHandle" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} className="mt-1 text-xs" />
          </div>

          <div>
            <Label htmlFor="googleSiteVerification" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Google Site Verification Code</Label>
            <Input id="googleSiteVerification" value={googleSiteVerification} onChange={(e) => setGoogleSiteVerification(e.target.value)} className="mt-1 text-xs font-mono" />
          </div>
        </div>
      </form>
    </div>
  );
}
