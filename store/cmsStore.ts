import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CmsPage,
  BlogPost,
  BlogCategory,
  BlogTag,
  MediaItem,
  MediaFolder,
  CmsMenu,
  FaqItem,
  Testimonial,
  LandingPage,
  SeoGlobalConfig,
  RedirectRule,
  BrokenUrlReport,
  SitemapConfig,
  RobotsTxtConfig,
  SchemaMarkup,
  MetaTagRule,
  ScheduledContentItem,
  VersionRevision,
  CmsStats,
} from '@/types/cms';

// Initial Mock Seed Data for Enterprise CMS
const INITIAL_PAGES: CmsPage[] = [
  {
    id: 'page-1',
    title: 'About Our Enterprise Platform',
    slug: 'about-us',
    content: `<h2>Empowering Enterprise Intelligence</h2><p>Aero Enterprise provides real-time supply chain, inventory, and order orchestration engines built for global industrial operations.</p><p>Founded in 2024, our architecture supports millisecond synchronization across distributed warehouse networks and multi-channel catalogs.</p>`,
    summary: 'Overview of company vision, technology stack, and enterprise leadership.',
    featuredImage: 'https://picsum.photos/seed/aboutus/800/400',
    pageTemplate: 'default',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    author: 'Yash Gupta',
    views: 14250,
    seoSettings: {
      metaTitle: 'About Us | Aero Enterprise Operating System',
      metaDescription: 'Learn how Aero Enterprise empowers global industrial supply chains with real-time analytics.',
      keywords: 'enterprise, supply chain, ERP, orchestration, platform',
      canonicalUrl: 'https://enterprise.aero.io/about-us',
    },
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-06-15T10:30:00.000Z',
  },
  {
    id: 'page-2',
    title: 'Global Compliance & Governance Standards',
    slug: 'compliance-and-governance',
    content: `<h2>SOC2 Type II & ISO 27001 Certified</h2><p>Our infrastructure enforces strict end-to-end data encryption, granular role-based access control (RBAC), and continuous audit logging.</p>`,
    summary: 'Security protocols, compliance standards, and privacy frameworks.',
    featuredImage: 'https://picsum.photos/seed/compliance/800/400',
    pageTemplate: 'full-width',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    author: 'Sarah Connor',
    views: 8930,
    seoSettings: {
      metaTitle: 'Security & Compliance Frameworks | Aero',
      metaDescription: 'Enterprise compliance, SOC2, GDPR, and data protection certifications.',
      keywords: 'security, compliance, SOC2, ISO27001, RBAC',
      canonicalUrl: 'https://enterprise.aero.io/compliance-and-governance',
    },
    createdAt: '2026-02-01T09:15:00.000Z',
    updatedAt: '2026-05-20T14:10:00.000Z',
  },
  {
    id: 'page-3',
    title: 'Next-Gen Supply Chain Automation Whitepaper',
    slug: 'supply-chain-whitepaper-2026',
    content: `<h2>Automating Industrial Logistics with AI</h2><p>Detailed analysis on how predictive inventory routing cuts holding costs by 34% across high-frequency fulfillment centers.</p>`,
    summary: 'Whitepaper detailing predictive routing algorithms for heavy logistics.',
    featuredImage: 'https://picsum.photos/seed/whitepaper/800/400',
    pageTemplate: 'landing',
    status: 'SCHEDULED',
    visibility: 'PUBLIC',
    schedulePublishAt: '2026-08-01T00:00:00.000Z',
    author: 'Michael Scott',
    views: 0,
    seoSettings: {
      metaTitle: 'Supply Chain Automation 2026 | Aero Research',
      metaDescription: 'Download our comprehensive 2026 whitepaper on AI-assisted inventory management.',
      keywords: 'whitepaper, logistics, AI, inventory automation',
    },
    createdAt: '2026-07-01T11:00:00.000Z',
    updatedAt: '2026-07-10T16:45:00.000Z',
  },
];

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Scaling Real-Time Order Orchestration to 10M Operations/Day',
    slug: 'scaling-order-orchestration-10m-ops',
    categoryId: 'cat-eng',
    categoryName: 'Engineering & Tech',
    tagIds: ['tag-perf', 'tag-nextjs'],
    tagNames: ['Performance', 'Next.js'],
    author: 'Yash Gupta',
    summary: 'An inside look at our event-driven architecture, distributed locks, and state synchronization across global clusters.',
    content: `<p>Managing order throughput during peak sales volume demands zero-latency concurrency. In this post, we discuss our message queue strategies and database indexing choices.</p><h2>Key Architectural Pillars</h2><ul><li>Optimistic concurrency control in transactional state stores</li><li>Read-replica auto-scaling during spike events</li><li>Sub-50ms WebSocket telemetry propagation</li></ul>`,
    featuredImage: 'https://picsum.photos/seed/blogscale/800/400',
    gallery: [
      'https://picsum.photos/seed/arch1/600/400',
      'https://picsum.photos/seed/arch2/600/400',
    ],
    seo: {
      metaTitle: 'Scaling Order Orchestration Architecture | Aero Engineering',
      metaDescription: 'Deep technical walkthrough on high-throughput order processing and event streaming.',
      keywords: 'engineering, architecture, high-throughput, scaling, Nextjs',
    },
    commentsCount: 18,
    status: 'PUBLISHED',
    publishDate: '2026-06-12T09:00:00.000Z',
    isFeatured: true,
    views: 24100,
    createdAt: '2026-06-10T12:00:00.000Z',
    updatedAt: '2026-06-12T09:00:00.000Z',
  },
  {
    id: 'blog-2',
    title: '5 Cost-Reduction Strategies for Warehouse Inventory Holding',
    slug: '5-cost-reduction-strategies-warehouse-inventory',
    categoryId: 'cat-ops',
    categoryName: 'Operations & Logistics',
    tagIds: ['tag-inv', 'tag-cost'],
    tagNames: ['Inventory', 'Cost Control'],
    author: 'Sarah Connor',
    summary: 'Reduce carrying costs and inventory obsolescence using dynamic Safety Stock calculations and cycle counting schedules.',
    content: `<p>Inventory holding costs can consume up to 25% of annual capital expenditure if not governed rigorously. Here are 5 battle-tested strategies to optimize warehouse utilization.</p>`,
    featuredImage: 'https://picsum.photos/seed/blogwh/800/400',
    gallery: [],
    seo: {
      metaTitle: '5 Warehouse Cost Reduction Strategies | Aero Logistics',
      metaDescription: 'Optimize warehouse carrying costs and eliminate stock holding waste.',
      keywords: 'warehouse, inventory, carrying costs, cycle count',
    },
    commentsCount: 7,
    status: 'PUBLISHED',
    publishDate: '2026-07-02T10:00:00.000Z',
    isFeatured: false,
    views: 11200,
    createdAt: '2026-06-28T14:00:00.000Z',
    updatedAt: '2026-07-02T10:00:00.000Z',
  },
];

const INITIAL_CATEGORIES: BlogCategory[] = [
  { id: 'cat-eng', title: 'Engineering & Tech', slug: 'engineering-tech', description: 'Deep technical posts on software architecture, APIs, and infrastructure.', status: 'ACTIVE', seo: { metaTitle: 'Engineering Tech Blog', metaDescription: 'Tech posts', keywords: 'tech, eng' }, postsCount: 14, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-ops', title: 'Operations & Logistics', slug: 'operations-logistics', description: 'Best practices for warehouse management, fulfillment, and shipping.', status: 'ACTIVE', seo: { metaTitle: 'Operations & Logistics Blog', metaDescription: 'Logistics posts', keywords: 'ops, logistics' }, postsCount: 9, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-fin', title: 'Finance & Tax', slug: 'finance-tax', description: 'Guides on reconciliation, GST invoicing, and corporate payment gateways.', status: 'ACTIVE', seo: { metaTitle: 'Finance & Tax Blog', metaDescription: 'Finance posts', keywords: 'tax, invoice, finance' }, postsCount: 6, createdAt: '2026-01-01T00:00:00.000Z' },
];

const INITIAL_TAGS: BlogTag[] = [
  { id: 'tag-perf', name: 'Performance', slug: 'performance', description: 'High speed and low latency optimizations', status: 'ACTIVE', postsCount: 12 },
  { id: 'tag-nextjs', name: 'Next.js', slug: 'nextjs', description: 'React 19 & Next.js App Router insights', status: 'ACTIVE', postsCount: 8 },
  { id: 'tag-inv', name: 'Inventory', slug: 'inventory', description: 'Stock control and warehouse automation', status: 'ACTIVE', postsCount: 15 },
  { id: 'tag-cost', name: 'Cost Control', slug: 'cost-control', description: 'Financial savings and budget management', status: 'ACTIVE', postsCount: 6 },
];

const INITIAL_MEDIA: MediaItem[] = [
  { id: 'med-1', name: 'hero-banner-main.webp', url: 'https://picsum.photos/seed/mainbanner/1200/600', fileType: 'image', mimeType: 'image/webp', size: 245000, dimensions: { width: 1200, height: 600 }, folder: 'Banners', altText: 'Aero Enterprise Main Platform Banner', caption: 'Platform overview header', uploadedAt: '2026-07-15T08:00:00.000Z', uploadedBy: 'Yash Gupta' },
  { id: 'med-2', name: 'compliance-seal.png', url: 'https://picsum.photos/seed/seal/400/400', fileType: 'image', mimeType: 'image/png', size: 112000, dimensions: { width: 400, height: 400 }, folder: 'Logos', altText: 'SOC2 Compliance Badge', caption: 'Official SOC2 badge', uploadedAt: '2026-07-16T09:30:00.000Z', uploadedBy: 'Sarah Connor' },
  { id: 'med-3', name: 'system-architecture-2026.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'document', mimeType: 'application/pdf', size: 1450000, folder: 'Whitepapers', altText: 'Architecture diagram PDF', caption: 'Full technical diagram', uploadedAt: '2026-07-18T14:15:00.000Z', uploadedBy: 'Yash Gupta' },
  { id: 'med-4', name: 'warehouse-demo.mp4', url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', fileType: 'video', mimeType: 'video/mp4', size: 8400000, folder: 'Videos', altText: 'Warehouse fulfillment video', caption: 'Automated picking queue demo', uploadedAt: '2026-07-20T11:00:00.000Z', uploadedBy: 'Michael Scott' },
];

const INITIAL_FOLDERS: MediaFolder[] = [
  { id: 'fld-root', name: 'All Files', path: '/', itemsCount: 4 },
  { id: 'fld-banners', name: 'Banners', path: '/Banners', itemsCount: 1 },
  { id: 'fld-logos', name: 'Logos', path: '/Logos', itemsCount: 1 },
  { id: 'fld-whitepapers', name: 'Whitepapers', path: '/Whitepapers', itemsCount: 1 },
  { id: 'fld-videos', name: 'Videos', path: '/Videos', itemsCount: 1 },
];

const INITIAL_MENUS: CmsMenu[] = [
  {
    id: 'menu-header',
    title: 'Primary Navigation Header',
    location: 'HEADER',
    status: 'ACTIVE',
    updatedAt: '2026-07-10T10:00:00.000Z',
    items: [
      { id: 'mi-1', label: 'Products', url: '/products', target: '_self', sortOrder: 1 },
      { id: 'mi-2', label: 'Solutions', url: '/solutions', target: '_self', sortOrder: 2, children: [
        { id: 'mi-21', label: 'Warehouse ERP', url: '/solutions/warehouse', target: '_self', sortOrder: 1 },
        { id: 'mi-22', label: 'Order Orchestration', url: '/solutions/orders', target: '_self', sortOrder: 2 },
      ]},
      { id: 'mi-3', label: 'Resources', url: '/blog', target: '_self', sortOrder: 3 },
      { id: 'mi-4', label: 'About Us', url: '/about-us', target: '_self', sortOrder: 4 },
    ],
  },
  {
    id: 'menu-footer',
    title: 'Corporate Footer Links',
    location: 'FOOTER',
    status: 'ACTIVE',
    updatedAt: '2026-07-12T11:00:00.000Z',
    items: [
      { id: 'mi-f1', label: 'Privacy Policy', url: '/privacy', target: '_self', sortOrder: 1 },
      { id: 'mi-f2', label: 'Terms of Service', url: '/terms', target: '_self', sortOrder: 2 },
      { id: 'mi-f3', label: 'Compliance & Security', url: '/compliance-and-governance', target: '_self', sortOrder: 3 },
    ],
  },
];

const INITIAL_FAQS: FaqItem[] = [
  { id: 'faq-1', question: 'How quickly does order status sync across warehouses?', answer: 'Our real-time engine synchronizes inventory and status across regional nodes within <50ms under normal operating load.', category: 'Platform & Tech', sortOrder: 1, status: 'PUBLISHED', updatedAt: '2026-06-01T10:00:00.000Z' },
  { id: 'faq-2', question: 'Which payment gateways are supported out-of-the-box?', answer: 'Aero supports Stripe, Razorpay, PayPal, Cashfree, PhonePe, Paytm, COD, and custom Bank Transfer direct reconciliation.', category: 'Payments & Billing', sortOrder: 2, status: 'PUBLISHED', updatedAt: '2026-06-05T12:00:00.000Z' },
  { id: 'faq-3', question: 'Can I generate automated GST / Tax breakdowns?', answer: 'Yes, invoice generation automatically calculates CGST, SGST, IGST, and HSN codes based on delivery state boundaries.', category: 'Tax & Compliance', sortOrder: 3, status: 'PUBLISHED', updatedAt: '2026-06-10T09:00:00.000Z' },
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', customerName: 'David Miller', designation: 'VP of Global Logistics', company: 'Apex Freight Heavy Industries', photo: 'https://picsum.photos/seed/davidm/150/150', rating: 5, review: 'Aero reduced our order processing lag from 12 minutes to under 2 seconds across 18 regional warehouses.', status: 'APPROVED', sortOrder: 1, createdAt: '2026-05-15T00:00:00.000Z' },
  { id: 'test-2', customerName: 'Elena Rostova', designation: 'Chief Supply Chain Officer', company: 'NORDIC Industrial Group', photo: 'https://picsum.photos/seed/elena/150/150', rating: 5, review: 'The integrated CMS and CMS page builder allowed us to publish whitepapers and landing pages without waiting for developer cycles.', status: 'APPROVED', sortOrder: 2, createdAt: '2026-06-01T00:00:00.000Z' },
];

const INITIAL_LANDING_PAGES: LandingPage[] = [
  {
    id: 'land-1',
    title: 'Enterprise Q3 Logistics Summit Campaign',
    slug: 'q3-logistics-summit-2026',
    template: 'hero-with-countdown',
    sections: [
      { id: 'sec-1', type: 'hero', title: 'Global Supply Chain Summit 2026', subtitle: 'Join 5,000+ industry executives in Chicago or stream live online.', settings: { ctaText: 'Register Free', ctaUrl: '/register', bgImage: 'https://picsum.photos/seed/summitbg/1200/600' } },
      { id: 'sec-2', type: 'countdown', title: 'Event Starts In', settings: { countdownEndDate: '2026-09-15T09:00:00.000Z' } },
      { id: 'sec-3', type: 'testimonials', title: 'What Past Attendees Say', settings: {} },
    ],
    status: 'PUBLISHED',
    seo: { metaTitle: 'Q3 Logistics Summit 2026 | Aero Event', metaDescription: 'Register now for the premier industrial supply chain summit.', keywords: 'summit, logistics, event, Chicago' },
    views: 4520,
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-15T10:00:00.000Z',
  },
];

const INITIAL_SEO: SeoGlobalConfig = {
  metaTitle: 'Aero Enterprise Operating System',
  metaDescription: 'Unified cloud platform for enterprise supply chain, catalog management, CRM, and financial billing.',
  keywords: 'enterprise, ERP, supply chain, cloud, orchestration, logistics',
  canonicalUrl: 'https://enterprise.aero.io',
  ogImage: 'https://picsum.photos/seed/aeroog/1200/630',
  twitterCard: 'summary_large_image',
  robotsMeta: 'index, follow, max-image-preview:large, max-snippet:-1',
  googleSiteVerification: 'google-site-verification-token-aero-2026',
  bingSiteVerification: 'bing-site-verification-token-aero-2026',
};

const INITIAL_REDIRECTS: RedirectRule[] = [
  { id: 'red-1', sourceUrl: '/old-about', targetUrl: '/about-us', statusCode: 301, hits: 1420, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'red-2', sourceUrl: '/whitepaper-2025', targetUrl: '/compliance-and-governance', statusCode: 302, hits: 890, status: 'ACTIVE', createdAt: '2026-03-10T00:00:00.000Z' },
];

const INITIAL_BROKEN_URLS: BrokenUrlReport[] = [
  { id: 'brk-1', url: '/blog/legacy-article-404', referrer: 'https://google.com/search', statusCode: 404, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', occurrences: 84, lastDetected: '2026-07-21T18:30:00.000Z' },
  { id: 'brk-2', url: '/downloads/setup.exe', referrer: 'https://internal-docs.company.com', statusCode: 404, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', occurrences: 19, lastDetected: '2026-07-20T14:12:00.000Z' },
];

const INITIAL_SITEMAPS: SitemapConfig[] = [
  { id: 'sm-cms', type: 'CMS', filename: 'sitemap-pages.xml', totalUrls: 24, lastGeneratedAt: '2026-07-21T00:00:00.000Z', autoGenerate: true, pingSearchEngines: true },
  { id: 'sm-blog', type: 'BLOG', filename: 'sitemap-blogs.xml', totalUrls: 85, lastGeneratedAt: '2026-07-21T00:00:00.000Z', autoGenerate: true, pingSearchEngines: true },
  { id: 'sm-prod', type: 'PRODUCT', filename: 'sitemap-products.xml', totalUrls: 1420, lastGeneratedAt: '2026-07-20T12:00:00.000Z', autoGenerate: true, pingSearchEngines: false },
  { id: 'sm-cat', type: 'CATEGORY', filename: 'sitemap-categories.xml', totalUrls: 48, lastGeneratedAt: '2026-07-20T12:00:00.000Z', autoGenerate: true, pingSearchEngines: false },
];

const INITIAL_ROBOTS: RobotsTxtConfig = {
  content: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /checkout/\n\nSitemap: https://enterprise.aero.io/sitemap-pages.xml\nSitemap: https://enterprise.aero.io/sitemap-blogs.xml`,
  isCustom: true,
  lastSavedAt: '2026-07-15T09:00:00.000Z',
  status: 'VALID',
};

const INITIAL_SCHEMA: SchemaMarkup[] = [
  {
    id: 'sch-org',
    type: 'Organization',
    name: 'Corporate Organization Schema',
    pagePattern: 'Global',
    jsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Aero Enterprise Technologies Inc.',
      url: 'https://enterprise.aero.io',
      logo: 'https://enterprise.aero.io/logo.png',
      sameAs: ['https://twitter.com/aero_enterprise', 'https://linkedin.com/company/aero-enterprise'],
    }, null, 2),
    status: 'ACTIVE',
    updatedAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'sch-faq',
    type: 'FAQPage',
    name: 'Global FAQ Accordion Schema',
    pagePattern: '/faqs*',
    jsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How fast is order sync?', acceptedAnswer: { '@type': 'Answer', text: 'Sub 50ms latency globally.' } },
      ],
    }, null, 2),
    status: 'ACTIVE',
    updatedAt: '2026-06-10T12:00:00.000Z',
  },
];

const INITIAL_META_RULES: MetaTagRule[] = [
  {
    id: 'meta-1',
    name: 'Global Open Graph Standard Tags',
    pageType: 'GLOBAL',
    selectorPattern: '/*',
    metaTags: [
      { property: 'og:site_name', content: 'Aero Enterprise Portal' },
      { property: 'og:type', content: 'website' },
      { name: 'author', content: 'Aero Core Engineering' },
    ],
    status: 'ACTIVE',
  },
];

const INITIAL_SCHEDULED: ScheduledContentItem[] = [
  {
    id: 'sch-1',
    contentId: 'page-3',
    contentTitle: 'Next-Gen Supply Chain Automation Whitepaper',
    contentType: 'PAGE',
    action: 'PUBLISH',
    scheduledAt: '2026-08-01T00:00:00.000Z',
    status: 'PENDING',
    createdBy: 'Michael Scott',
  },
];

const INITIAL_REVISIONS: VersionRevision[] = [
  {
    id: 'rev-1',
    contentId: 'page-1',
    contentType: 'PAGE',
    versionNumber: 2,
    author: 'Yash Gupta',
    summaryNote: 'Updated executive introduction and compliance references.',
    changesSummary: 'Modified headings, added sub-50ms latency metrics.',
    snapshotData: { title: 'About Our Enterprise Platform', status: 'PUBLISHED' },
    createdAt: '2026-06-15T10:30:00.000Z',
  },
  {
    id: 'rev-2',
    contentId: 'page-1',
    contentType: 'PAGE',
    versionNumber: 1,
    author: 'Yash Gupta',
    summaryNote: 'Initial draft publication.',
    changesSummary: 'Created page document.',
    snapshotData: { title: 'About Our Enterprise Platform', status: 'DRAFT' },
    createdAt: '2026-01-10T08:00:00.000Z',
  },
];

interface CmsState {
  pages: CmsPage[];
  blogs: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  mediaItems: MediaItem[];
  folders: MediaFolder[];
  menus: CmsMenu[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  landingPages: LandingPage[];
  seoConfig: SeoGlobalConfig;
  redirects: RedirectRule[];
  brokenUrls: BrokenUrlReport[];
  sitemaps: SitemapConfig[];
  robotsConfig: RobotsTxtConfig;
  schemas: SchemaMarkup[];
  metaRules: MetaTagRule[];
  scheduledQueue: ScheduledContentItem[];
  revisions: VersionRevision[];

  // Actions - Pages
  addPage: (page: Omit<CmsPage, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => CmsPage;
  updatePage: (id: string, page: Partial<CmsPage>) => void;
  deletePage: (id: string) => void;
  bulkPublishPages: (ids: string[]) => void;
  bulkUnpublishPages: (ids: string[]) => void;
  bulkDeletePages: (ids: string[]) => void;

  // Actions - Blogs
  addBlog: (blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'commentsCount'>) => BlogPost;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;

  // Actions - Categories & Tags
  addCategory: (cat: Omit<BlogCategory, 'id' | 'createdAt' | 'postsCount'>) => BlogCategory;
  updateCategory: (id: string, cat: Partial<BlogCategory>) => void;
  deleteCategory: (id: string) => void;
  addTag: (tag: Omit<BlogTag, 'id' | 'postsCount'>) => BlogTag;
  updateTag: (id: string, tag: Partial<BlogTag>) => void;
  deleteTag: (id: string) => void;

  // Actions - Media
  uploadMedia: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  deleteMedia: (id: string) => void;
  bulkDeleteMedia: (ids: string[]) => void;
  addFolder: (name: string, path: string) => void;

  // Actions - Menus
  saveMenu: (menu: CmsMenu) => void;
  deleteMenu: (id: string) => void;

  // Actions - FAQs & Testimonials
  addFaq: (faq: Omit<FaqItem, 'id' | 'updatedAt'>) => FaqItem;
  updateFaq: (id: string, faq: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  addTestimonial: (test: Omit<Testimonial, 'id' | 'createdAt'>) => Testimonial;
  updateTestimonial: (id: string, test: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Actions - Landing Pages
  addLandingPage: (landing: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => LandingPage;
  updateLandingPage: (id: string, landing: Partial<LandingPage>) => void;
  deleteLandingPage: (id: string) => void;

  // Actions - SEO & Tools
  updateSeoConfig: (config: Partial<SeoGlobalConfig>) => void;
  addRedirect: (rule: Omit<RedirectRule, 'id' | 'hits' | 'createdAt'>) => RedirectRule;
  deleteRedirect: (id: string) => void;
  updateRobotsTxt: (content: string) => void;
  saveSchema: (schema: Partial<SchemaMarkup> & { name: string; type: any; jsonLd: string }) => void;
  deleteSchema: (id: string) => void;
  saveMetaRule: (rule: Partial<MetaTagRule> & { name: string; pageType: any }) => void;
  deleteMetaRule: (id: string) => void;

  // Actions - Scheduler & Rollback
  scheduleContent: (item: Omit<ScheduledContentItem, 'id' | 'status'>) => void;
  cancelScheduledContent: (id: string) => void;
  restoreRevision: (revisionId: string) => void;

  // Stats Getter
  getStats: () => CmsStats;
}

export const useCmsStore = create<CmsState>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,
      blogs: INITIAL_BLOGS,
      categories: INITIAL_CATEGORIES,
      tags: INITIAL_TAGS,
      mediaItems: INITIAL_MEDIA,
      folders: INITIAL_FOLDERS,
      menus: INITIAL_MENUS,
      faqs: INITIAL_FAQS,
      testimonials: INITIAL_TESTIMONIALS,
      landingPages: INITIAL_LANDING_PAGES,
      seoConfig: INITIAL_SEO,
      redirects: INITIAL_REDIRECTS,
      brokenUrls: INITIAL_BROKEN_URLS,
      sitemaps: INITIAL_SITEMAPS,
      robotsConfig: INITIAL_ROBOTS,
      schemas: INITIAL_SCHEMA,
      metaRules: INITIAL_META_RULES,
      scheduledQueue: INITIAL_SCHEDULED,
      revisions: INITIAL_REVISIONS,

      // Actions - Pages
      addPage: (pageData) => {
        const now = new Date().toISOString();
        const newPage: CmsPage = {
          ...pageData,
          id: `page-${Date.now()}`,
          views: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ pages: [newPage, ...state.pages] }));
        return newPage;
      },
      updatePage: (id, pageData) => {
        set((state) => {
          const now = new Date().toISOString();
          const existing = state.pages.find((p) => p.id === id);
          if (!existing) return state;

          // Save revision snapshot before updating
          const newRevision: VersionRevision = {
            id: `rev-${Date.now()}`,
            contentId: id,
            contentType: 'PAGE',
            versionNumber: state.revisions.filter((r) => r.contentId === id).length + 1,
            author: pageData.author || existing.author || 'System User',
            summaryNote: 'Updated content and metadata',
            changesSummary: 'Modified fields in CMS editor',
            snapshotData: existing,
            createdAt: now,
          };

          return {
            pages: state.pages.map((p) => (p.id === id ? { ...p, ...pageData, updatedAt: now } : p)),
            revisions: [newRevision, ...state.revisions],
          };
        });
      },
      deletePage: (id) => set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),
      bulkPublishPages: (ids) =>
        set((state) => ({
          pages: state.pages.map((p) => (ids.includes(p.id) ? { ...p, status: 'PUBLISHED', updatedAt: new Date().toISOString() } : p)),
        })),
      bulkUnpublishPages: (ids) =>
        set((state) => ({
          pages: state.pages.map((p) => (ids.includes(p.id) ? { ...p, status: 'DRAFT', updatedAt: new Date().toISOString() } : p)),
        })),
      bulkDeletePages: (ids) => set((state) => ({ pages: state.pages.filter((p) => !ids.includes(p.id)) })),

      // Actions - Blogs
      addBlog: (blogData) => {
        const now = new Date().toISOString();
        const newBlog: BlogPost = {
          ...blogData,
          id: `blog-${Date.now()}`,
          commentsCount: 0,
          views: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ blogs: [newBlog, ...state.blogs] }));
        return newBlog;
      },
      updateBlog: (id, blogData) =>
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? { ...b, ...blogData, updatedAt: new Date().toISOString() } : b)),
        })),
      deleteBlog: (id) => set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) })),

      // Actions - Categories & Tags
      addCategory: (catData) => {
        const newCat: BlogCategory = {
          ...catData,
          id: `cat-${Date.now()}`,
          postsCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ categories: [...state.categories, newCat] }));
        return newCat;
      },
      updateCategory: (id, catData) =>
        set((state) => ({ categories: state.categories.map((c) => (c.id === id ? { ...c, ...catData } : c)) })),
      deleteCategory: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),

      addTag: (tagData) => {
        const newTag: BlogTag = {
          ...tagData,
          id: `tag-${Date.now()}`,
          postsCount: 0,
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
        return newTag;
      },
      updateTag: (id, tagData) =>
        set((state) => ({ tags: state.tags.map((t) => (t.id === id ? { ...t, ...tagData } : t)) })),
      deleteTag: (id) => set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),

      // Actions - Media
      uploadMedia: (itemData) => {
        const newItem: MediaItem = {
          ...itemData,
          id: `med-${Date.now()}`,
          uploadedAt: new Date().toISOString(),
        };
        set((state) => ({ mediaItems: [newItem, ...state.mediaItems] }));
        return newItem;
      },
      deleteMedia: (id) => set((state) => ({ mediaItems: state.mediaItems.filter((m) => m.id !== id) })),
      bulkDeleteMedia: (ids) => set((state) => ({ mediaItems: state.mediaItems.filter((m) => !ids.includes(m.id)) })),
      addFolder: (name, path) =>
        set((state) => ({
          folders: [...state.folders, { id: `fld-${Date.now()}`, name, path, itemsCount: 0 }],
        })),

      // Actions - Menus
      saveMenu: (menu) =>
        set((state) => {
          const exists = state.menus.some((m) => m.id === menu.id);
          const updated = { ...menu, updatedAt: new Date().toISOString() };
          return {
            menus: exists ? state.menus.map((m) => (m.id === menu.id ? updated : m)) : [...state.menus, updated],
          };
        }),
      deleteMenu: (id) => set((state) => ({ menus: state.menus.filter((m) => m.id !== id) })),

      // Actions - FAQs & Testimonials
      addFaq: (faqData) => {
        const newFaq: FaqItem = {
          ...faqData,
          id: `faq-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ faqs: [...state.faqs, newFaq] }));
        return newFaq;
      },
      updateFaq: (id, faqData) =>
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...faqData, updatedAt: new Date().toISOString() } : f)),
        })),
      deleteFaq: (id) => set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) })),

      addTestimonial: (testData) => {
        const newTest: Testimonial = {
          ...testData,
          id: `test-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ testimonials: [newTest, ...state.testimonials] }));
        return newTest;
      },
      updateTestimonial: (id, testData) =>
        set((state) => ({ testimonials: state.testimonials.map((t) => (t.id === id ? { ...t, ...testData } : t)) })),
      deleteTestimonial: (id) => set((state) => ({ testimonials: state.testimonials.filter((t) => t.id !== id) })),

      // Actions - Landing Pages
      addLandingPage: (landingData) => {
        const now = new Date().toISOString();
        const newLanding: LandingPage = {
          ...landingData,
          id: `land-${Date.now()}`,
          views: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ landingPages: [newLanding, ...state.landingPages] }));
        return newLanding;
      },
      updateLandingPage: (id, landingData) =>
        set((state) => ({
          landingPages: state.landingPages.map((l) =>
            l.id === id ? { ...l, ...landingData, updatedAt: new Date().toISOString() } : l
          ),
        })),
      deleteLandingPage: (id) => set((state) => ({ landingPages: state.landingPages.filter((l) => l.id !== id) })),

      // Actions - SEO & Tools
      updateSeoConfig: (config) => set((state) => ({ seoConfig: { ...state.seoConfig, ...config } })),
      addRedirect: (ruleData) => {
        const newRule: RedirectRule = {
          ...ruleData,
          id: `red-${Date.now()}`,
          hits: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ redirects: [newRule, ...state.redirects] }));
        return newRule;
      },
      deleteRedirect: (id) => set((state) => ({ redirects: state.redirects.filter((r) => r.id !== id) })),
      updateRobotsTxt: (content) =>
        set(() => ({
          robotsConfig: {
            content,
            isCustom: true,
            lastSavedAt: new Date().toISOString(),
            status: 'VALID',
          },
        })),
      saveSchema: (schemaData) =>
        set((state) => {
          if (schemaData.id) {
            return {
              schemas: state.schemas.map((s) =>
                s.id === schemaData.id ? { ...s, ...schemaData, updatedAt: new Date().toISOString() } : s
              ),
            };
          }
          const newSchema: SchemaMarkup = {
            id: `sch-${Date.now()}`,
            name: schemaData.name,
            type: schemaData.type,
            jsonLd: schemaData.jsonLd,
            pagePattern: schemaData.pagePattern || 'Global',
            status: 'ACTIVE',
            updatedAt: new Date().toISOString(),
          };
          return { schemas: [...state.schemas, newSchema] };
        }),
      deleteSchema: (id) => set((state) => ({ schemas: state.schemas.filter((s) => s.id !== id) })),
      saveMetaRule: (ruleData) =>
        set((state) => {
          if (ruleData.id) {
            return {
              metaRules: state.metaRules.map((m) => (m.id === ruleData.id ? { ...m, ...ruleData } : m)),
            };
          }
          const newRule: MetaTagRule = {
            id: `meta-${Date.now()}`,
            name: ruleData.name,
            pageType: ruleData.pageType,
            selectorPattern: ruleData.selectorPattern || '/*',
            metaTags: ruleData.metaTags || [],
            status: 'ACTIVE',
          };
          return { metaRules: [...state.metaRules, newRule] };
        }),
      deleteMetaRule: (id) => set((state) => ({ metaRules: state.metaRules.filter((m) => m.id !== id) })),

      // Actions - Scheduler & Rollback
      scheduleContent: (item) => {
        const newItem: ScheduledContentItem = {
          ...item,
          id: `sch-${Date.now()}`,
          status: 'PENDING',
        };
        set((state) => ({ scheduledQueue: [newItem, ...state.scheduledQueue] }));
      },
      cancelScheduledContent: (id) =>
        set((state) => ({
          scheduledQueue: state.scheduledQueue.map((s) => (s.id === id ? { ...s, status: 'CANCELLED' } : s)),
        })),
      restoreRevision: (revisionId) => {
        const { revisions, pages } = get();
        const rev = revisions.find((r) => r.id === revisionId);
        if (!rev || !rev.snapshotData) return;

        if (rev.contentType === 'PAGE') {
          set((state) => ({
            pages: state.pages.map((p) => (p.id === rev.contentId ? { ...p, ...rev.snapshotData, updatedAt: new Date().toISOString() } : p)),
          }));
        }
      },

      getStats: () => {
        const state = get();
        const totalPages = state.pages.length;
        const publishedPages = state.pages.filter((p) => p.status === 'PUBLISHED').length;
        const draftPages = state.pages.filter((p) => p.status === 'DRAFT').length;
        const scheduledPages = state.pages.filter((p) => p.status === 'SCHEDULED').length;
        const totalBlogs = state.blogs.length;
        const totalMediaFiles = state.mediaItems.length;
        const totalLandingPages = state.landingPages.length;
        const totalRedirects = state.redirects.length;
        const totalSitemapUrls = state.sitemaps.reduce((acc, s) => acc + s.totalUrls, 0);

        return {
          totalPages,
          publishedPages,
          draftPages,
          scheduledPages,
          totalBlogs,
          totalMediaFiles,
          totalLandingPages,
          seoScore: 94, // High enterprise audit score
          totalRedirects,
          totalSitemapUrls,
        };
      },
    }),
    {
      name: 'ent_cms_store_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
