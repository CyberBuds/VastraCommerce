import { create } from 'zustand';
import {
  BlogPost,
  BlogTag,
  BlogCategory, // Changed from CmsCategory
  CmsContentStatus,
  CmsMenu,
  CmsPage,
  FaqItem,
  LandingPage,
  MediaItem,
  MetaTagRule,
  RedirectRule,
  RobotsTxtConfig,
  ScheduledContentItem,
  SchemaMarkup,
  SeoGlobalConfig,
  SitemapConfig,
  Testimonial,
  VersionRevision,
  CmsStats,
} from '@/types/cms';

interface CmsState {
  stats: CmsStats;
  pages: CmsPage[];
  blogs: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  mediaItems: MediaItem[];
  menus: CmsMenu[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  landingPages: LandingPage[];
  schemas: SchemaMarkup[];
  redirects: RedirectRule[];
  sitemapConfig: SitemapConfig[];
  robotsTxt: RobotsTxtConfig;
  seoConfig: SeoGlobalConfig;
  metaTags: MetaTagRule[];
  scheduledQueue: ScheduledContentItem[];
  versions: VersionRevision[];

  // Actions
  getStats: () => CmsStats;
  addPage: (page: Omit<CmsPage, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => void;
  updatePage: (id: string, page: Partial<Omit<CmsPage, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deletePage: (id: string) => void;
  bulkPublishPages: (ids: string[]) => void;
  bulkUnpublishPages: (ids: string[]) => void;
  bulkDeletePages: (ids: string[]) => void;

  addBlog: (blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'commentsCount' | 'isFeatured'>) => void;
  updateBlog: (id: string, blog: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteBlog: (id: string) => void;

  addCategory: (category: Omit<BlogCategory, 'id' | 'postsCount' | 'createdAt'>) => void;
  deleteCategory: (id: string) => void;

  addTag: (tag: Omit<BlogTag, 'id' | 'postsCount'>) => void;
  deleteTag: (id: string) => void;

  uploadMedia: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  deleteMedia: (id: string) => void;

  addMenu: (menu: Omit<CmsMenu, 'id' | 'updatedAt'>) => void;
  updateMenu: (id: string, menu: Partial<Omit<CmsMenu, 'id' | 'updatedAt'>>) => void;
  deleteMenu: (id: string) => void;

  addFaq: (faq: Omit<FaqItem, 'id' | 'updatedAt'>) => void;
  deleteFaq: (id: string) => void;

  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  deleteTestimonial: (id: string) => void;

  addLandingPage: (page: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => void;
  updateLandingPage: (id: string, page: Partial<Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteLandingPage: (id: string) => void;

  addSchema: (schema: Omit<SchemaMarkup, 'id' | 'updatedAt'>) => void;
  deleteSchema: (id: string) => void;

  addRedirect: (redirect: Omit<RedirectRule, 'id' | 'createdAt' | 'hits'>) => void;
  deleteRedirect: (id: string) => void;

  updateSitemapConfig: (id: string, config: Partial<Omit<SitemapConfig, 'id'>>) => void;
  updateRobotsTxt: (config: RobotsTxtConfig) => void;
  updateSeoConfig: (config: SeoGlobalConfig) => void;

  addMetaTag: (tag: Omit<MetaTagRule, 'id'>) => void;
  deleteMetaTag: (id: string) => void;
}

export const useCmsStore = create<CmsState>((set, get) => ({
    stats: { totalPages: 0, publishedPages: 0, draftPages: 0, scheduledPages: 0, totalBlogs: 0, totalMediaFiles: 0, totalLandingPages: 0, seoScore: 0, totalRedirects: 0, totalSitemapUrls: 0 },
    pages: [],
    blogs: [],
    categories: [],
    tags: [],
    mediaItems: [],
    menus: [],
    faqs: [],
    testimonials: [],
    landingPages: [],
    schemas: [],
    redirects: [],
    sitemapConfig: [],
    robotsTxt: { content: '', isCustom: false, lastSavedAt: '', status: 'VALID' },
    seoConfig: { siteName: '', titleTemplate: '', defaultMetaDescription: '', keywords: '', canonicalUrl: '', defaultOgImage: '', twitterHandle: '', twitterCard: 'summary', robotsMeta: '', googleSiteVerification: '', bingSiteVerification: '' },
    metaTags: [],
    scheduledQueue: [],
    versions: [],

    getStats: () => get().stats,
    addPage: (page) => set((state) => ({ pages: [...state.pages, { ...page, id: `page-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0 }] })),
    updatePage: (id, page) => set((state) => ({ pages: state.pages.map((p) => (p.id === id ? { ...p, ...page, updatedAt: new Date().toISOString() } : p)) })),
    deletePage: (id) => set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),
    bulkPublishPages: (ids) =>
      set((state) => ({
        pages: state.pages.map((p) =>
          ids.includes(p.id) ? { ...p, status: 'PUBLISHED', updatedAt: new Date().toISOString() } : p
        ),
      })),
    bulkUnpublishPages: (ids) =>
      set((state) => ({
        pages: state.pages.map((p) =>
          ids.includes(p.id) ? { ...p, status: 'DRAFT', updatedAt: new Date().toISOString() } : p
        ),
      })),
    bulkDeletePages: (ids) => set((state) => ({ pages: state.pages.filter((p) => !ids.includes(p.id)) })),

    addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, { ...blog, id: `blog-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0, commentsCount: 0, isFeatured: false }] })),
    updateBlog: (id, blog) => set((state) => ({ blogs: state.blogs.map((b) => (b.id === id ? { ...b, ...blog, updatedAt: new Date().toISOString() } : b)) })),
    deleteBlog: (id) => set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) })),

    addCategory: (category) => set((state) => ({ categories: [...state.categories, { ...category, id: `cat-${Date.now()}`, postsCount: 0, createdAt: new Date().toISOString() }] })),
    deleteCategory: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),

    addTag: (tag) => set((state) => ({ tags: [...state.tags, { ...tag, id: `tag-${Date.now()}`, postsCount: 0 }] })),
    deleteTag: (id) => set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),

    uploadMedia: (item) => {
        const newItem = { ...item, id: `media-${Date.now()}`, uploadedAt: new Date().toISOString() };
        set((state) => ({ mediaItems: [...state.mediaItems, newItem] }));
        return newItem;
    },
    deleteMedia: (id) => set((state) => ({ mediaItems: state.mediaItems.filter((m) => m.id !== id) })),

    addMenu: (menu) => set((state) => ({ menus: [...state.menus, { ...menu, id: `menu-${Date.now()}`, updatedAt: new Date().toISOString() }] })),
    updateMenu: (id, menu) => set((state) => ({ menus: state.menus.map((m) => (m.id === id ? { ...m, ...menu, updatedAt: new Date().toISOString() } : m)) })),
    deleteMenu: (id) => set((state) => ({ menus: state.menus.filter((m) => m.id !== id) })),

    addFaq: (faq) => set((state) => ({ faqs: [...state.faqs, { ...faq, id: `faq-${Date.now()}`, updatedAt: new Date().toISOString() }] })),
    deleteFaq: (id) => set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) })),

    addTestimonial: (testimonial) => set((state) => ({ testimonials: [...state.testimonials, { ...testimonial, id: `test-${Date.now()}`, createdAt: new Date().toISOString() }] })),
    deleteTestimonial: (id) => set((state) => ({ testimonials: state.testimonials.filter((t) => t.id !== id) })),

    addLandingPage: (page) => set((state) => ({ landingPages: [...state.landingPages, { ...page, id: `lp-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0 }] })),
    updateLandingPage: (id, page) => set((state) => ({ landingPages: state.landingPages.map((p) => (p.id === id ? { ...p, ...page, updatedAt: new Date().toISOString() } : p)) })),
    deleteLandingPage: (id) => set((state) => ({ landingPages: state.landingPages.filter((p) => p.id !== id) })),

    addSchema: (schema) => set((state) => ({ schemas: [...state.schemas, { ...schema, id: `schema-${Date.now()}`, updatedAt: new Date().toISOString() }] })),
    deleteSchema: (id) => set((state) => ({ schemas: state.schemas.filter((s) => s.id !== id) })),

    addRedirect: (redirect) => set((state) => ({ redirects: [...state.redirects, { ...redirect, id: `redir-${Date.now()}`, createdAt: new Date().toISOString(), hits: 0 }] })),
    deleteRedirect: (id) => set((state) => ({ redirects: state.redirects.filter((r) => r.id !== id) })),

    updateSitemapConfig: (id, config) => set((state) => ({ sitemapConfig: state.sitemapConfig.map((sc) => (sc.id === id ? { ...sc, ...config } : sc)) })),
    updateRobotsTxt: (config) => set(() => ({ robotsTxt: config })),
    updateSeoConfig: (config) => set(() => ({ seoConfig: config })),

    addMetaTag: (tag) => set((state) => ({ metaTags: [...state.metaTags, { ...tag, id: `meta-${Date.now()}` }] })),
    deleteMetaTag: (id) => set((state) => ({ metaTags: state.metaTags.filter((mt) => mt.id !== id) })),
}));