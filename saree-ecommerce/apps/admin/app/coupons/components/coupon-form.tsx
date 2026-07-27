// app/coupons/components/coupon-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { couponSchema } from '@/features/marketing/types/validation';
import { Coupon } from '@/types/marketing';
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
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  useCreateCoupon,
  useUpdateCoupon,
} from '@/features/marketing/hooks/useCoupons';
import { useRouter } from 'next/navigation';

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  initialData?: Coupon;
}

export function CouponForm({ initialData }: CouponFormProps) {
  const router = useRouter();
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: new Date(initialData.startDate).toISOString(),
          endDate: new Date(initialData.endDate).toISOString(),
        }
      : {
          status: 'ACTIVE',
          type: 'PERCENTAGE',
        },
  });

  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();

  const onSubmit = (data: CouponFormValues) => {
    if (initialData) {
      updateCouponMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            router.push('/coupons');
          },
        }
      );
    } else {
      createCouponMutation.mutate(data, {
        onSuccess: () => {
          router.push('/coupons');
        },
      });
    }
  };

  const isLoading = createCouponMutation.isPending || updateCouponMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. SUMMER25" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. 25% off for summer" {...field} />
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
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a discount type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FLAT">Flat Amount</SelectItem>
                        <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 25" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Minimum Order Amount</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 100" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Maximum Discount Amount</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 50" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="maxUsageCount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Max Total Usage</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 1000" {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="perCustomerLimit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Usage Limit Per Customer</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 1" {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
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
            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
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
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
