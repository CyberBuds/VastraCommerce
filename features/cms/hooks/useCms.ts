import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { useCmsStore } from '@/store/cmsStore';
import { CmsPage, BlogPost, MediaItem, CmsMenu, FaqItem, Testimonial, LandingPage, SeoGlobalConfig, RedirectRule, SchemaMarkup, MetaTagRule } from '@/types/cms';
import { toast } from 'sonner';

export const CMS_QUERY_KEYS = {
  stats: ['cms', 'stats'],
  pages: ['cms', 'pages'],
  page: (id: string) => ['cms', 'page', id],
  blogs: ['cms', 'blogs'],
  blog: (id: string) => ['cms', 'blog', id],
  categories: ['cms', 'categories'],
  tags: ['cms', 'tags'],
  media: ['cms', 'media'],
  menus: ['cms', 'menus'],
  faqs: ['cms', 'faqs'],
  testimonials: ['cms', 'testimonials'],
  landingPages: ['cms', 'landingPages'],
  seo: ['cms', 'seo'],
  redirects: ['cms', 'redirects'],
  sitemaps: ['cms', 'sitemaps'],
  robots: ['cms', 'robots'],
  schemas: ['cms', 'schemas'],
  metaRules: ['cms', 'metaRules'],
  scheduler: ['cms', 'scheduler'],
  revisions: (contentId?: string) => ['cms', 'revisions', contentId || 'all'],
};

export function useCmsStatsQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.stats,
    queryFn: async () => {
      try {
        const res = await cmsService.getStats();
        return res.data;
      } catch {
        return cmsStore.getStats();
      }
    },
    initialData: cmsStore.getStats(),
  });
}

export function useCmsPagesQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.pages,
    queryFn: async () => {
      try {
        const res = await cmsService.getAll();
        return res.data;
      } catch {
        return cmsStore.pages;
      }
    },
    initialData: cmsStore.pages,
  });
}

export function useCmsPageQuery(id: string) {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.page(id),
    queryFn: async () => {
      try {
        const res = await cmsService.getById(id);
        return res.data;
      } catch {
        return cmsStore.pages.find((p) => p.id === id);
      }
    },
    enabled: !!id,
    initialData: cmsStore.pages.find((p) => p.id === id),
  });
}

export function useCreatePageMutation() {
  const queryClient = useQueryClient();
  const cmsStore = useCmsStore();

  return useMutation({
    mutationFn: async (newPage: Omit<CmsPage, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
      const created = cmsStore.addPage(newPage);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.pages });
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.stats });
      toast.success('CMS Page created successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create page');
    },
  });
}

export function useUpdatePageMutation() {
  const queryClient = useQueryClient();
  const cmsStore = useCmsStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CmsPage> }) => {
      cmsStore.updatePage(id, data);
      return cmsStore.pages.find((p) => p.id === id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.pages });
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.page(variables.id) });
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.stats });
      toast.success('Page updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update page');
    },
  });
}

export function useDeletePageMutation() {
  const queryClient = useQueryClient();
  const cmsStore = useCmsStore();

  return useMutation({
    mutationFn: async (id: string) => {
      cmsStore.deletePage(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.pages });
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.stats });
      toast.success('Page deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete page');
    },
  });
}

export function useBlogsQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.blogs,
    queryFn: async () => cmsStore.blogs,
    initialData: cmsStore.blogs,
  });
}

export function useMediaLibraryQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.media,
    queryFn: async () => cmsStore.mediaItems,
    initialData: cmsStore.mediaItems,
  });
}

export function useMenusQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.menus,
    queryFn: async () => cmsStore.menus,
    initialData: cmsStore.menus,
  });
}

export function useFaqsQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.faqs,
    queryFn: async () => cmsStore.faqs,
    initialData: cmsStore.faqs,
  });
}

export function useTestimonialsQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.testimonials,
    queryFn: async () => cmsStore.testimonials,
    initialData: cmsStore.testimonials,
  });
}

export function useLandingPagesQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.landingPages,
    queryFn: async () => cmsStore.landingPages,
    initialData: cmsStore.landingPages,
  });
}

export function useSeoQuery() {
  const cmsStore = useCmsStore();
  return useQuery({
    queryKey: CMS_QUERY_KEYS.seo,
    queryFn: async () => cmsStore.seoConfig,
    initialData: cmsStore.seoConfig,
  });
}
