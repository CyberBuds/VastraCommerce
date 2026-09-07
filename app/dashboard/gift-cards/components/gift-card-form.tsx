// app/gift-cards/components/gift-card-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { giftCardSchema } from '@/features/marketing/types/validation';
import { GiftCard } from '@/types/marketing';
import { z } from 'zod';

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/enterprise/BaseInputs';
import {
  useCreateGiftCard,
} from '@/features/marketing/hooks/useGiftCards';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, Calendar } from '@/components/enterprise/InteractiveComponents';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type GiftCardFormValues = z.infer<typeof giftCardSchema>;

interface GiftCardFormProps {
  initialData?: GiftCard;
}

export function GiftCardForm({ initialData }: GiftCardFormProps) {
  const router = useRouter();
  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(giftCardSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          expiryDate: new Date(initialData.expiryDate).toISOString(),
        }
      : {},
  });

  const createGiftCardMutation = useCreateGiftCard();

  const onSubmit = (data: GiftCardFormValues) => {
    createGiftCardMutation.mutate(data, {
        onSuccess: () => {
            router.refresh();
        }
    });
  };

  const isLoading = createGiftCardMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. GC-12345" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="initialAmount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g. 100" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="recipientEmail"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Recipient Email (Optional)</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="e.g. recipient@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(new Date(field.value), 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Gift Card'}
        </Button>
      </form>
    </Form>
  );
}
