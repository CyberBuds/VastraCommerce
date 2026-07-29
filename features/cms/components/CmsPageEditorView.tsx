'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { RichTextEditor } from './RichTextEditor';
import { MediaPickerModal } from './MediaPickerModal';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { CmsPage, CmsPageTemplate, CmsContentStatus, CmsVisibility } from '@/types/cms';
import { Save, Eye, Globe, Image as ImageIcon, Sparkles, ArrowLeft, Clock } from 'lucide-react';
import { toast } from 'sonner';

const pageSchema = z.object({
  title: z.string().min(2, 'Title is required (min 2 characters)'),
  slug: z.string().min(2, 'Slug is required'),
  parentId: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  featuredImage: z.string().optional(),
  pageTemplate: z.enum(['default', 'landing', 'full-width', 'sidebar', 'contact']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED']),
  password: z.string().optional(),
  schedulePublishAt: z.string().optional(),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

interface CmsPageEditorViewProps {
  pageId?: string;
}

export function CmsPageEditorView({ pageId }: CmsPageEditorViewProps) {
  const router = useRouter();
  const { pages, addPage, updatePage } = useCmsStore();
  const existingPage = pageId ? pages.find((p) => p.id === pageId) : undefined;

  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: existingPage?.title || '',
      slug: existingPage?.slug || '',
      parentId: existingPage?.parentId || '',
      summary: existingPage?.summary || '',
      content: existingPage?.content || '<h2>Write page content here...</h2><p>Provide detailed enterprise documentation or layout text.</p>',
      featuredImage: existingPage?.featuredImage || '',
      pageTemplate: existingPage?.pageTemplate || 'default',
      status: existingPage?.status || 'DRAFT',
      visibility: existingPage?.visibility || 'PUBLIC',
      password: existingPage?.password || '',
      schedulePublishAt: existingPage?.schedulePublishAt || '',
      authorName: existingPage?.author.name || 'Yash Gupta',
      authorRole: existingPage?.author.role || 'Admin',
      metaTitle: existingPage?.seoSettings?.metaTitle || '',
      metaDescription: existingPage?.seoSettings?.metaDescription || '',
      keywords: existingPage?.seoSettings?.keywords || '',
      canonicalUrl: existingPage?.seoSettings?.canonicalUrl || '',
    },
  });

  const watchTitle = watch('title');
  const watchStatus = watch('status');

  // Auto-generate slug from title
  React.useEffect(() => {
    if (!existingPage && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  }, [watchTitle, existingPage, setValue]);

  const onSubmit = (data: PageFormData) => {
    const seoSettings = {
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.summary || '',
      keywords: data.keywords || '',
      canonicalUrl: data.canonicalUrl || `https://enterprise.aero.io/${data.slug}`,
    };
    
    const author = { name: data.authorName || 'Current User', role: data.authorRole || 'Admin' };

    if (existingPage) {
      updatePage(existingPage.id, {
        title: data.title,
        slug: data.slug,
        parentId: data.parentId,
        summary: data.summary,
        content: data.content,
        featuredImage: data.featuredImage,
        pageTemplate: data.pageTemplate as CmsPageTemplate,
        status: data.status as CmsContentStatus,
        visibility: data.visibility as CmsVisibility,
        password: data.password,
        schedulePublishAt: data.schedulePublishAt,
        author,
        seoSettings,
      });
      toast.success('Page updated successfully!');
    } else {
      addPage({
        title: data.title,
        slug: data.slug,
        parentId: data.parentId,
        summary: data.summary,
        content: data.content,
        featuredImage: data.featuredImage,
        pageTemplate: data.pageTemplate as CmsPageTemplate,
        status: data.status as CmsContentStatus,
        visibility: data.visibility as CmsVisibility,
        password: data.password,
        schedulePublishAt: data.schedulePublishAt,
        author,
        seoSettings,
      });
      toast.success('Page created successfully!');
    }

    router.push('/cms/pages');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title={existingPage ? `Edit Page: ${existingPage.title}` : 'Create New CMS Page'}
        description="Design and publish web pages with structured templates, WYSIWYG editor, and SEO controls."
        breadcrumbs={[{ label: 'Pages', href: '/cms/pages' }, { label: existingPage ? 'Edit' : 'New Page' }]}
        secondaryButton={{
          label: 'Back to List',
          icon: <ArrowLeft className="w-4 h-4" />,
          onClick: () => router.push('/cms/pages'),
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Left (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Title & Slug Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <div>
              <Label htmlFor="title" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Page Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Enterprise Operating Governance"
                className="mt-1 text-base font-bold"
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  URL Slug <span className="text-rose-500">*</span>
                </Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-mono text-slate-400">/</span>
                  <Input id="slug" {...register('slug')} placeholder="page-url-slug" className="font-mono text-xs" />
                </div>
                {errors.slug && <p className="text-xs text-rose-500 mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <Label htmlFor="authorName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Author Name
                </Label>
                <Input id="authorName" {...register('authorName')} className="mt-1 text-xs" />
              </div>
            </div>

            <div>
              <Label htmlFor="summary" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Short Page Excerpt / Summary
              </Label>
              <textarea
                id="summary"
                {...register('summary')}
                rows={2}
                placeholder="Brief summary displayed in site search, page cards, and social snippets..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          {/* WYSIWYG Content Editor */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Page Main Content (HTML / Rich Text)
            </Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />
          </div>

          {/* SEO Metadata Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> Page SEO & Meta Tags
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Search Engine Optimized</span>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="metaTitle" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  SEO Meta Title
                </Label>
                <Input id="metaTitle" {...register('metaTitle')} placeholder="Custom title for Google search results" className="mt-1 text-xs" />
              </div>

              <div>
                <Label htmlFor="metaDescription" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Meta Description
                </Label>
                <textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  rows={2}
                  placeholder="Appears in search engine result snippets (recommended 150-160 characters)"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <Label htmlFor="keywords" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Target Keywords
                </Label>
                <Input id="keywords" {...register('keywords')} placeholder="enterprise, governance, logistics, AI" className="mt-1 text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Right (1 col) */}
        <div className="space-y-6">
          {/* Publish & Status Box */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2">
              Publishing Controls
            </h3>

            <div>
              <Label htmlFor="status" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Publication Status
              </Label>
              <Select id="status" {...register('status')} className="mt-1 text-xs font-semibold">
                <option value="DRAFT">DRAFT - Save as working copy</option>
                <option value="PUBLISHED">PUBLISHED - Live on production</option>
                <option value="SCHEDULED">SCHEDULED - Auto publish on date</option>
                <option value="ARCHIVED">ARCHIVED - Hide from public</option>
              </Select>
            </div>

            {watchStatus === 'SCHEDULED' && (
              <div>
                <Label htmlFor="schedulePublishAt" className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Scheduled Date & Time
                </Label>
                <Input id="schedulePublishAt" type="datetime-local" {...register('schedulePublishAt')} className="mt-1 text-xs font-mono" />
              </div>
            )}

            <div>
              <Label htmlFor="visibility" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Access Visibility
              </Label>
              <Select id="visibility" {...register('visibility')} className="mt-1 text-xs">
                <option value="PUBLIC">PUBLIC - Searchable by all</option>
                <option value="PRIVATE">PRIVATE - Logged-in admin only</option>
                <option value="PASSWORD_PROTECTED">PASSWORD PROTECTED</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="pageTemplate" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Page Template
              </Label>
              <Select id="pageTemplate" {...register('pageTemplate')} className="mt-1 text-xs font-medium">
                <option value="default">Default Standard Layout</option>
                <option value="landing">Landing Page Hero Banner</option>
                <option value="full-width">Full Width Canvas</option>
                <option value="sidebar">Sidebar Navigation Layout</option>
                <option value="contact">Contact & Form Layout</option>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 text-xs font-bold gap-2 shadow-md bg-slate-900 text-white dark:bg-brand dark:text-white"
            >
              <Save className="w-4 h-4" />
              {existingPage ? 'Update Page' : 'Publish / Save Page'}
            </Button>
          </div>

          {/* Featured Image Box */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-3 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-850 pb-2">
              Featured Banner Asset
            </h3>

            {watch('featuredImage') ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 aspect-video">
                <img src={watch('featuredImage')} alt="Featured" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="absolute inset-0 bg-slate-950/60 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsMediaModalOpen(true)}
                className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center cursor-pointer hover:border-slate-400 dark:hover:border-zinc-700 transition-colors bg-slate-50/50 dark:bg-zinc-950/40"
              >
                <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">Set Featured Image</p>
                <p className="text-[10px] text-slate-400 mt-1">Recommended size 1200x630px</p>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setValue('featuredImage', url, { shouldDirty: true })}
      />
    </div>
  );
}
