// app/banners/components/banner-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bannerSchema } from '@/features/marketing/types/validation';
import { Banner } from '@/types/marketing';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateBanner,
  useUpdateBanner,
} from '@/features/marketing/hooks/useBanners';
import { useRouter } from 'next/navigation';
import { FileUploader } from '@/components/ui/file-uploader';

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: Banner;
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          status: 'ACTIVE',
          type: 'HOMEPAGE',
          priority: 1,
        },
  });

  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();

  const onSubmit = (data: BannerFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('link', data.link);
    formData.append('type', data.type);
    formData.append('priority', data.priority.toString());
    formData.append('status', data.status);
    if (data.image) {
        formData.append('image', data.image);
    }

    if (initialData) {
      updateBannerMutation.mutate(
        { id: initialData.id, data: formData },
        {
          onSuccess: () => {
            router.refresh();
          },
        }
      );
    } else {
      createBannerMutation.mutate(formData, {
        onSuccess: () => {
            router.refresh();
        },
      });
    }
  };

  const isLoading = createBannerMutation.isPending || updateBannerMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Summer Sale Banner" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. /products/summer-collection" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Banner Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a banner type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="DESKTOP">Desktop</SelectItem>
                        <SelectItem value="MOBILE">Mobile</SelectItem>
                        <SelectItem value="TABLET">Tablet</SelectItem>
                        <SelectItem value="HOMEPAGE">Homepage</SelectItem>
                        <SelectItem value="CATEGORY">Category</SelectItem>
                        <SelectItem value="POPUP">Popup</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                        <FileUploader
                            value={field.value ? [field.value] : []}
                            onValueChange={(files) => field.onChange(files[0])}
                            maxFiles={1}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
