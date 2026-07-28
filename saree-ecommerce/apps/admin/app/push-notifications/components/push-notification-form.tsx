// app/push-notifications/components/push-notification-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pushNotificationSchema } from '@/features/marketing/types/validation';
import { PushNotification } from '@/types/marketing';
import { z } from 'zod';

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '@/components/enterprise/BaseInputs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    useCreatePushNotification,
} from '@/features/marketing/hooks/usePushNotifications';
import { useRouter } from 'next/navigation';

type PushNotificationFormValues = z.infer<typeof pushNotificationSchema>;

export function PushNotificationForm() {
  const router = useRouter();
  const form = useForm<PushNotificationFormValues>({
    resolver: zodResolver(pushNotificationSchema),
    defaultValues: {
        priority: 'normal',
    },
  });

  const createPushNotificationMutation = useCreatePushNotification();

  const onSubmit = (data: PushNotificationFormValues) => {
    createPushNotificationMutation.mutate(data, {
        onSuccess: () => {
            router.refresh();
        }
    });
  };

  const isLoading = createPushNotificationMutation.isPending;

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
                    <Input placeholder="e.g. New Arrivals!" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                    <Textarea placeholder="Check out the latest collection of sarees." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="targetUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Target URL</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. /products/new-arrivals" {...field} />
                </FormControl>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Notification'}
        </Button>
      </form>
    </Form>
  );
}
