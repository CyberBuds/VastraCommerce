export type CmsContentStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type CmsVisibility = 'PUBLIC' | 'PRIVATE' | 'PASSWORD_PROTECTED';
export type CmsPageTemplate = 'default' | 'landing' | 'full-width' | 'sidebar' | 'contact';
export type CmsMenuLocation = 'HEADER' | 'FOOTER' | 'MOBILE' | 'MEGA_MENU';
export type CmsMediaType = 'image' | 'video' | 'document';

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  noFollow?: boolean;
  structuredDataJson?: string;
}

export interface Author {
  name: string;
  role: string;
  avatar?: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  parentId?: string;
  parentTitle?: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  banner?: string;
  pageTemplate: CmsPageTemplate;
  status: CmsContentStatus;
  visibility: CmsVisibility;
  password?: string;
  schedulePublishAt?: string;
  author: Author;
  views: number;
  seoSettings: SeoSettings;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  tagIds: string[];
  tagNames: string[];
  author: Author;
  summary: string;
  content: string;
  featuredImage?: string;
  gallery: string[];
  seo: SeoSettings;
  commentsCount: number;
  status: CmsContentStatus;
  publishDate: string;
  isFeatured?: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  slug: string;
  parentId?: string;
  parentTitle?: string;
  description: string;
  featuredImage?: string;
  status: 'ACTIVE' | 'INACTIVE';
  seo: SeoSettings;
  postsCount: number;
  createdAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  postsCount: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  fileType: CmsMediaType;
  mimeType: string;
  size: number; // in bytes
  dimensions?: { width: number; height: number };
  folder: string;
  altText?: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  path: string;
  itemsCount: number;
}

export interface MenuItemNode {
  id: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
  icon?: string;
  children?: MenuItemNode[];
  sortOrder: number;
}

export interface CmsMenu {
  id: string;
  title: string;
  location: CmsMenuLocation;
  items: MenuItemNode[];
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  designation: string;
  company: string;
  photo?: string;
  rating: number; // 1-5
  review: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  sortOrder: number;
  createdAt: string;
}

export interface LandingSection {
  id: string;
  type: 'hero' | 'product_grid' | 'countdown' | 'testimonials' | 'cta' | 'rich_text';
  title: string;
  subtitle?: string;
  content?: string;
  settings: {
    ctaText?: string;
    ctaUrl?: string;
    bgImage?: string;
    countdownEndDate?: string;
    productsCount?: number;
    accentColor?: string;
  };
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  template: string;
  sections: LandingSection[];
  status: CmsContentStatus;
  seo: SeoSettings;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeoGlobalConfig {
  siteName: string;
  titleTemplate: string;
  defaultMetaDescription: string;
  keywords: string;
  canonicalUrl: string;
  defaultOgImage: string;
  twitterHandle: string;
  twitterCard: 'summary' | 'summary_large_image';
  robotsMeta: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
}

export interface RedirectRule {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  statusCode: 301 | 302;
  hits: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface BrokenUrlReport {
  id: string;
  url: string;
  referrer: string;
  statusCode: number;
  userAgent: string;
  occurrences: number;
  lastDetected: string;
}

export interface SitemapConfig {
  id: string;
  type: 'PRODUCT' | 'CATEGORY' | 'BLOG' | 'CMS';
  filename: string;
  totalUrls: number;
  lastGeneratedAt: string;
  autoGenerate: boolean;
  pingSearchEngines: boolean;
}

export interface RobotsTxtConfig {
  content: string;
  isCustom: boolean;
  lastSavedAt: string;
  status: 'VALID' | 'WARNING';
}

export interface SchemaMarkup {
  id: string;
  type: 'Organization' | 'Product' | 'BreadcrumbList' | 'FAQPage' | 'Article' | 'Review' | 'LocalBusiness';
  name: string;
  jsonLd: string;
  pagePattern: string;
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export interface MetaTagRule {
  id: string;
  name: string;
  pageType: 'GLOBAL' | 'PAGE' | 'PRODUCT' | 'BLOG' | 'CATEGORY';
  selectorPattern: string;
  metaTags: { name?: string; property?: string; content: string }[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ScheduledContentItem {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'PAGE' | 'BLOG' | 'LANDING_PAGE';
  action: 'PUBLISH' | 'UNPUBLISH';
  scheduledAt: string;
  recurringCron?: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
  createdBy: string;
}

export interface VersionRevision {
  id: string;
  contentId: string;
  contentType: 'PAGE' | 'BLOG' | 'LANDING_PAGE';
  versionNumber: number;
  author: string;
  summaryNote: string;
  changesSummary: string;
  snapshotData: Record<string, any>;
  createdAt: string;
}

export interface CmsStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  scheduledPages: number;
  totalBlogs: number;
  totalMediaFiles: number;
  totalLandingPages: number;
  seoScore: number;
  totalRedirects: number;
  totalSitemapUrls: number;
}
