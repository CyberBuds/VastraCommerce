import { api, BaseFeatureApi } from './api';
import { ApiResponse } from '@/types/common';
import {
  CmsPage,
  BlogPost,
  BlogCategory,
  BlogTag,
  MediaItem,
  CmsMenu,
  FaqItem,
  Testimonial,
  LandingPage,
  SeoGlobalConfig,
  RedirectRule,
  SitemapConfig,
  RobotsTxtConfig,
  SchemaMarkup,
  MetaTagRule,
  ScheduledContentItem,
  VersionRevision,
  CmsStats,
} from '@/types/cms';

export class CmsService extends BaseFeatureApi<CmsPage> {
  constructor() {
    super('/api/cms/pages');
  }

  // Dashboard Stats
  async getStats(): Promise<ApiResponse<CmsStats>> {
    const res = await api.get<ApiResponse<CmsStats>>('/api/cms/stats');
    return res.data;
  }

  // Blog Posts
  async getBlogs(params?: any): Promise<ApiResponse<BlogPost[]>> {
    const res = await api.get<ApiResponse<BlogPost[]>>('/api/cms/blogs', { params });
    return res.data;
  }

  async getBlogById(id: string): Promise<ApiResponse<BlogPost>> {
    const res = await api.get<ApiResponse<BlogPost>>(`/api/cms/blogs/${id}`);
    return res.data;
  }

  async createBlog(data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    const res = await api.post<ApiResponse<BlogPost>>('/api/cms/blogs', data);
    return res.data;
  }

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    const res = await api.put<ApiResponse<BlogPost>>(`/api/cms/blogs/${id}`, data);
    return res.data;
  }

  async deleteBlog(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await api.delete<ApiResponse<{ id: string }>>(`/api/cms/blogs/${id}`);
    return res.data;
  }

  // Categories & Tags
  async getCategories(): Promise<ApiResponse<BlogCategory[]>> {
    const res = await api.get<ApiResponse<BlogCategory[]>>('/api/cms/categories');
    return res.data;
  }

  async getTags(): Promise<ApiResponse<BlogTag[]>> {
    const res = await api.get<ApiResponse<BlogTag[]>>('/api/cms/tags');
    return res.data;
  }

  // Media Library
  async getMediaItems(params?: any): Promise<ApiResponse<MediaItem[]>> {
    const res = await api.get<ApiResponse<MediaItem[]>>('/api/cms/media', { params });
    return res.data;
  }

  async uploadMedia(data: Partial<MediaItem>): Promise<ApiResponse<MediaItem>> {
    const res = await api.post<ApiResponse<MediaItem>>('/api/cms/media', data);
    return res.data;
  }

  // Menus
  async getMenus(): Promise<ApiResponse<CmsMenu[]>> {
    const res = await api.get<ApiResponse<CmsMenu[]>>('/api/cms/menus');
    return res.data;
  }

  async saveMenu(menu: Partial<CmsMenu>): Promise<ApiResponse<CmsMenu>> {
    const res = await api.post<ApiResponse<CmsMenu>>('/api/cms/menus', menu);
    return res.data;
  }

  // FAQs & Testimonials
  async getFaqs(): Promise<ApiResponse<FaqItem[]>> {
    const res = await api.get<ApiResponse<FaqItem[]>>('/api/cms/faqs');
    return res.data;
  }

  async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    const res = await api.get<ApiResponse<Testimonial[]>>('/api/cms/testimonials');
    return res.data;
  }

  // Landing Pages
  async getLandingPages(): Promise<ApiResponse<LandingPage[]>> {
    const res = await api.get<ApiResponse<LandingPage[]>>('/api/cms/landing-pages');
    return res.data;
  }

  // SEO & Technical CMS
  async getSeoConfig(): Promise<ApiResponse<SeoGlobalConfig>> {
    const res = await api.get<ApiResponse<SeoGlobalConfig>>('/api/cms/seo');
    return res.data;
  }

  async updateSeoConfig(config: Partial<SeoGlobalConfig>): Promise<ApiResponse<SeoGlobalConfig>> {
    const res = await api.put<ApiResponse<SeoGlobalConfig>>('/api/cms/seo', config);
    return res.data;
  }

  async getRedirects(): Promise<ApiResponse<RedirectRule[]>> {
    const res = await api.get<ApiResponse<RedirectRule[]>>('/api/cms/redirects');
    return res.data;
  }

  async getSitemaps(): Promise<ApiResponse<SitemapConfig[]>> {
    const res = await api.get<ApiResponse<SitemapConfig[]>>('/api/cms/sitemaps');
    return res.data;
  }

  async getRobotsTxt(): Promise<ApiResponse<RobotsTxtConfig>> {
    const res = await api.get<ApiResponse<RobotsTxtConfig>>('/api/cms/robots');
    return res.data;
  }

  async getSchemas(): Promise<ApiResponse<SchemaMarkup[]>> {
    const res = await api.get<ApiResponse<SchemaMarkup[]>>('/api/cms/schemas');
    return res.data;
  }

  async getMetaRules(): Promise<ApiResponse<MetaTagRule[]>> {
    const res = await api.get<ApiResponse<MetaTagRule[]>>('/api/cms/meta-rules');
    return res.data;
  }

  // Scheduler & Revisions
  async getScheduledContent(): Promise<ApiResponse<ScheduledContentItem[]>> {
    const res = await api.get<ApiResponse<ScheduledContentItem[]>>('/api/cms/scheduler');
    return res.data;
  }

  async getRevisions(contentId?: string): Promise<ApiResponse<VersionRevision[]>> {
    const res = await api.get<ApiResponse<VersionRevision[]>>('/api/cms/revisions', { params: { contentId } });
    return res.data;
  }
}

export const cmsService = new CmsService();
