'use client';

import * as React from 'react';
import { Eye, Smartphone, Laptop, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/enterprise/BaseInputs';

interface SEOPreviewCardProps {
  title: string;
  description: string;
  slug: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  onChange: (field: string, value: string) => void;
}

export function SEOPreviewCard({
  title,
  description,
  slug,
  keywords,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop',
  twitterCard = 'summary_large_image',
  onChange,
}: SEOPreviewCardProps) {
  const [device, setDevice] = React.useState<'mobile' | 'desktop'>('desktop');

  // Slug generator helper
  const handleGenerateSlug = (val: string) => {
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    onChange('slug', generated);
  };

  // SEO Score calculation
  const getSEOScore = () => {
    let score = 0;
    const details = [];

    if (title.length >= 30 && title.length <= 60) {
      score += 30;
      details.push({ ok: true, text: 'Title length is optimal (30-60 chars).' });
    } else {
      details.push({ ok: false, text: 'Title should be between 30 and 60 characters.' });
    }

    if (description.length >= 100 && description.length <= 160) {
      score += 30;
      details.push({ ok: true, text: 'Description length is optimal (100-160 chars).' });
    } else {
      details.push({ ok: false, text: 'Description should be between 100 and 160 characters.' });
    }

    if (slug.length > 3) {
      score += 15;
      details.push({ ok: true, text: 'Clean SEO-friendly slug defined.' });
    } else {
      details.push({ ok: false, text: 'Provide a search-friendly slug.' });
    }

    if (keywords.split(',').filter(k => k.trim().length > 0).length >= 3) {
      score += 15;
      details.push({ ok: true, text: 'Sufficient keywords specified (3+).' });
    } else {
      details.push({ ok: false, text: 'Specify at least 3 meta keywords.' });
    }

    if (canonicalUrl.startsWith('https://')) {
      score += 10;
      details.push({ ok: true, text: 'Secure canonical URL present.' });
    } else {
      details.push({ ok: false, text: 'Missing valid canonical secure link.' });
    }

    return { score, details };
  };

  const { score: seoScore, details: seoDetails } = getSEOScore();

  return (
    <div className="space-y-6" id="seo-preview-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Fields (Left column) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEO Fields</span>
            <button
              type="button"
              onClick={() => handleGenerateSlug(title)}
              className="text-xs font-bold text-slate-900 hover:text-slate-700 dark:text-brand dark:hover:text-brand/80 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Slug
            </button>
          </div>

          <Input
            label="Meta Title"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
                  placeholder="Product name | VastraCommerce"
            helperText={`${title.length} characters (Recommended: 30-60)`}
            id="seo-meta-title"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Meta Description</label>
            <textarea
              value={description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Purchase the heavy-duty AeroFlow Turbine X1 engineered for ultra-high temperature tolerances and aerospace fuel loops. Certifications included."
              rows={3}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              id="seo-meta-description"
            />
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">
              {description.length} characters (Recommended: 100-160)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="URL Slug"
              value={slug}
              onChange={(e) => onChange('slug', e.target.value)}
              placeholder="aeroflow-turbine-x1"
              id="seo-url-slug"
            />
            <Input
              label="Canonical URL"
              value={canonicalUrl}
              onChange={(e) => onChange('canonicalUrl', e.target.value)}
              placeholder="https://aero.co/products/aeroflow-turbine-x1"
              id="seo-canonical-url"
            />
          </div>

          <Input
            label="Keywords (comma separated)"
            value={keywords}
            onChange={(e) => onChange('keywords', e.target.value)}
            placeholder="turbine, aerospace, heavy-duty, engine, calibrated"
            id="seo-keywords"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="OpenGraph Image Link"
              value={ogImage}
              onChange={(e) => onChange('ogImage', e.target.value)}
              id="seo-og-image"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Twitter Card Type</label>
              <select
                value={twitterCard}
                onChange={(e) => onChange('twitterCard', e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500 cursor-pointer"
                id="seo-twitter-card"
              >
                <option value="summary">Summary Card</option>
                <option value="summary_large_image">Large Banner Card</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO Previews (Right column) */}
        <div className="lg:col-span-6 space-y-6">
          {/* SEO Score Gauge */}
          <div className="bg-slate-50 dark:bg-zinc-950/40 border border-slate-200/60 dark:border-zinc-850 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">SEO Health Audit</span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                seoScore >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" :
                seoScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400" :
                "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400"
              )}>
                Score: {seoScore}/100
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-red-500"
                )}
                style={{ width: `${seoScore}%` }}
              />
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {seoDetails.map((det, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  {det.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className={cn(det.ok ? "text-slate-600 dark:text-zinc-400" : "text-slate-400 dark:text-zinc-500 font-medium")}>
                    {det.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Platform Previews */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Snippet Previews</span>
              <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  className={cn("p-1.5 px-3 rounded-md font-bold transition-all cursor-pointer", device === 'mobile' ? "bg-white dark:bg-zinc-900 shadow-xs" : "text-slate-400")}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  className={cn("p-1.5 px-3 rounded-md font-bold transition-all cursor-pointer", device === 'desktop' ? "bg-white dark:bg-zinc-900 shadow-xs" : "text-slate-400")}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Google Search Preview */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">Google Search Results Snippet</span>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className={cn("space-y-1.5", device === 'mobile' ? 'max-w-xs' : 'w-full')}>
                <div className="text-[11px] text-slate-500 dark:text-zinc-500 truncate">
                  {canonicalUrl || `https://aero.co/products/${slug || 'product-sku'}`}
                </div>
                <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight truncate">
                  {title || 'Please input meta title...'}
                </div>
                <div className="text-xs text-[#4d5156] dark:text-zinc-400 leading-snug break-words">
                  {description || 'Please input description parameters to generate mock search engine snippet preview...'}
                </div>
              </div>
            </div>

            {/* Facebook Share Preview */}
            <div className="bg-[#f0f2f5] dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-white dark:bg-zinc-900 p-2.5 px-4 text-[11px] font-bold text-slate-500 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <span>Facebook Share Preview</span>
              </div>
              <div className="w-full h-44 relative bg-slate-100 overflow-hidden">
                <img
                  src={ogImage}
                  alt="Facebook OG"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 border-t border-slate-100 dark:border-zinc-850">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  {new URL(canonicalUrl || 'https://aero.co').hostname}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1 truncate">
                  {title || 'Facebook OG Title'}
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-snug">
                  {description || 'Facebook OG Description snippet for social graph indexers.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
