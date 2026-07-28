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
import { BlogPost, CmsContentStatus } from '@/types/cms';
import { Save, ArrowLeft, Image as ImageIcon, BookOpen, Clock, Tag } from 'lucide-react';
import { toast } from 'sonner';

const blogSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  excerpt: z.string().min(5, 'Excerpt is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string(),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface CmsBlogEditorViewProps {
  blogId?: string;
}

export function CmsBlogEditorView({ blogId }: CmsBlogEditorViewProps) {
  const router = useRouter();
  const { blogs, categories, addBlog, updateBlog } = useCmsStore();
  const existingBlog = blogId ? blogs.find((b) => b.id === blogId) : undefined;

  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: existingBlog?.title || '',
      slug: existingBlog?.slug || '',
      excerpt: existingBlog?.summary || '',
      content: existingBlog?.content || '<h2>Write technical article content...</h2>',
      category: existingBlog?.categoryName || 'Engineering',
      tags: existingBlog?.tagNames.join(', ') || 'Next.js, Architecture',
      coverImage: existingBlog?.featuredImage || 'https://picsum.photos/seed/techblog/1200/600',
      status: existingBlog?.status || 'DRAFT',
      authorName: existingBlog?.author.name || 'Current User',
      authorRole: existingBlog?.author.role || 'Principal Architect',
    },
  });

  const watchTitle = watch('title');

  React.useEffect(() => {
    if (!existingBlog && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  }, [watchTitle, existingBlog, setValue]);

  const onSubmit = (data: BlogFormData) => {
    const tagsArr = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const authorName = data.authorName || 'Current User';
    const authorRole = data.authorRole || 'Principal Architect';

    if (existingBlog) {
      updateBlog(existingBlog.id, {
        title: data.title,
        slug: data.slug,
        summary: data.excerpt,
        content: data.content,
        categoryName: data.category,
        tagNames: tagsArr,
        featuredImage: data.coverImage,
        status: data.status as CmsContentStatus,
        author: {
          name: authorName,
          role: authorRole,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
      });
      toast.success('Blog post updated!');
    } else {
      addBlog({
        title: data.title,
        slug: data.slug,
        summary: data.excerpt,
        content: data.content,
        categoryName: data.category,
        tagNames: tagsArr,
        featuredImage: data.coverImage || 'https://picsum.photos/seed/techblog/1200/600',
        status: data.status as CmsContentStatus,
        author: {
          name: authorName,
          role: authorRole,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
        categoryId: '',
        tagIds: [],
        gallery: [],
        seo: {
          metaTitle: data.title,
          metaDescription: data.excerpt,
          keywords: data.tags,
        },
        publishDate: new Date().toISOString(),
      });
      toast.success('Blog post published!');
    }

    router.push('/cms/blogs');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title={existingBlog ? `Edit Blog: ${existingBlog.title}` : 'Create Blog Publication'}
        description="Write corporate articles, whitepapers, news releases, and technical documentation."
        breadcrumbs={[{ label: 'Blogs', href: '/cms/blogs' }, { label: existingBlog ? 'Edit' : 'New Post' }]}
        secondaryButton={{
          label: 'Back to Articles',
          icon: <ArrowLeft className="w-4 h-4" />,
          onClick: () => router.push('/cms/blogs'),
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <div>
              <Label htmlFor="title" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Article Title <span className="text-rose-500">*</span>
              </Label>
              <Input id="title" {...register('title')} placeholder="e.g., Architecting Next.js 15 for High Throughput" className="mt-1 text-base font-bold" />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Article Slug
                </Label>
                <Input id="slug" {...register('slug')} className="mt-1 text-xs font-mono" />
              </div>
              <div>
                <Label htmlFor="category" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Category
                </Label>
                <Select id="category" {...register('category')} className="mt-1 text-xs">
                  {categories.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Article Excerpt
              </Label>
              <textarea
                id="excerpt"
                {...register('excerpt')}
                rows={2}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Article Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} error={errors.content?.message} />
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2">
              Publication Settings
            </h3>

            <div>
              <Label htmlFor="status" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Status
              </Label>
              <Select id="status" {...register('status')} className="mt-1 text-xs">
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="SCHEDULED">SCHEDULED</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Tags (Comma Separated)
              </Label>
              <Input id="tags" {...register('tags')} className="mt-1 text-xs" />
            </div>

            <div>
              <Label htmlFor="authorName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Author Name
              </Label>
              <Input id="authorName" {...register('authorName')} className="mt-1 text-xs" />
            </div>

            <div>
              <Label htmlFor="authorRole" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Author Role
              </Label>
              <Input id="authorRole" {...register('authorRole')} className="mt-1 text-xs" />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-10 text-xs font-bold gap-2 shadow-md">
              <Save className="w-4 h-4" /> Save Article
            </Button>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-3 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-850 pb-2">
              Cover Image
            </h3>
            {watch('coverImage') ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 aspect-video">
                <img src={watch('coverImage')} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="absolute inset-0 bg-slate-950/60 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Change Cover
                </button>
              </div>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => setIsMediaModalOpen(true)} className="w-full text-xs">
                Upload Cover
              </Button>
            )}
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setValue('coverImage', url)}
      />
    </div>
  );
}
