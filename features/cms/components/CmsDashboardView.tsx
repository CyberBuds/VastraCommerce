'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import {
  FileText,
  CheckCircle2,
  FileClock,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Layout,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Compass,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Recharts dummy data series for CMS analytics
const CONTENT_GROWTH_DATA = [
  { month: 'Jan', pages: 12, blogs: 20 },
  { month: 'Feb', pages: 15, blogs: 32 },
  { month: 'Mar', pages: 18, blogs: 45 },
  { month: 'Apr', pages: 20, blogs: 58 },
  { month: 'May', pages: 22, blogs: 68 },
  { month: 'Jun', pages: 24, blogs: 82 },
  { month: 'Jul', pages: 27, blogs: 95 },
];

const BLOG_VIEWS_DATA = [
  { date: 'Mon', views: 4200 },
  { date: 'Tue', views: 6800 },
  { date: 'Wed', views: 9100 },
  { date: 'Thu', views: 12400 },
  { date: 'Fri', views: 10500 },
  { date: 'Sat', views: 5300 },
  { date: 'Sun', views: 7900 },
];

const SEO_TREND_DATA = [
  { week: 'W1', score: 82 },
  { week: 'W2', score: 85 },
  { week: 'W3', score: 89 },
  { week: 'W4', score: 91 },
  { week: 'W5', score: 94 },
];

const TRAFFIC_SOURCES_DATA = [
  { name: 'Organic Search', value: 58, color: '#10b981' },
  { name: 'Direct Traffic', value: 24, color: '#3b82f6' },
  { name: 'Referrals & Whitepapers', value: 12, color: '#f59e0b' },
  { name: 'Social & Media', value: 6, color: '#8b5cf6' },
];

export function CmsDashboardView() {
  const { getStats, pages, blogs, scheduledQueue } = useCmsStore();
  const stats = getStats();

  return (
    <div className="space-y-6">
      <CmsHeader
        title="CMS & Content Intelligence Hub"
        description="Monitor corporate publications, SEO performance, media library assets, and automated scheduling."
        breadcrumbs={[{ label: 'Dashboard' }]}
        actionButton={{
          label: 'New Page',
          href: '/cms/pages/new',
        }}
        secondaryButton={{
          label: 'New Blog Post',
          onClick: () => { window.location.href = '/cms/blogs/new'; },
        }}
      />

      {/* 10 Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Pages */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Pages</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.totalPages}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% this quarter
          </p>
        </div>

        {/* Published Pages */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Published</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.publishedPages}</p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Live on production</p>
        </div>

        {/* Draft Pages */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Drafts</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.draftPages}</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Pending approval</p>
        </div>

        {/* Scheduled Pages */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Scheduled</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.scheduledPages}</p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">In publishing queue</p>
        </div>

        {/* Total Blogs */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Blog Posts</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.totalBlogs}</p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Active publications</p>
        </div>

        {/* Media Files */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Media Assets</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.totalMediaFiles}</p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Images, PDFs, Videos</p>
        </div>

        {/* Landing Pages */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Landing Pages</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <Layout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.totalLandingPages}</p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Campaign builders</p>
        </div>

        {/* SEO Score Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">SEO Health Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats.seoScore}/100</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Grade A+ Audit</p>
        </div>

        {/* Total Redirects */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Redirect Rules</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.totalRedirects}</p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">301/302 Rules</p>
        </div>

        {/* Sitemap URLs */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Sitemap Index</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">{stats.totalSitemapUrls}</p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Indexed URLs</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Growth Chart */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Content Growth Index</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Cumulative published pages and blog posts over time</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONTENT_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="blogs" stroke="#10b981" fillOpacity={1} fill="url(#colorBlogs)" name="Blogs" />
                <Area type="monotone" dataKey="pages" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPages)" name="Pages" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Blog Traffic Chart */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Weekly Content Readership</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Total page views across blog and knowledge base</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BLOG_VIEWS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#6366f1" radius={[6, 6, 0, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts & Queue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SEO Score Trend */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-1">SEO Health Trend</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">Lighthouse & Schema audit trajectory</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEO_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="SEO Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Pie */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-1">Traffic Origin</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">Channel acquisition breakdown</p>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TRAFFIC_SOURCES_DATA} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {TRAFFIC_SOURCES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Scheduled Queue */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Publishing Queue</h3>
              <Link href="/cms/content-scheduler" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {scheduledQueue.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No pending scheduled items.</p>
              ) : (
                scheduledQueue.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg border border-slate-150 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{item.contentTitle}</p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400">Scheduled for {new Date(item.scheduledAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {item.action}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Sitemap Sync Engine</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Active (Auto)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
