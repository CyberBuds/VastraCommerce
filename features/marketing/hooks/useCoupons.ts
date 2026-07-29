// features/marketing/hooks/useCoupons.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  bulkDeleteCoupons,
  bulkUpdateCouponsStatus,
} from '@/services/marketingService';
import { Coupon } from '@/types/marketing';
import { toast } from 'sonner';
import { useMarketingStore } from '@/store/marketingStore';

const COUPONS_QUERY_KEY = 'coupons';

export const useGetCoupons = () => {
  const { couponFilters } = useMarketingStore();
  return useQuery({
    queryKey: [COUPONS_QUERY_KEY, couponFilters],
    queryFn: () => getCoupons(couponFilters),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetCoupon = (id: string) => {
  return useQuery({
    queryKey: [COUPONS_QUERY_KEY, id],
    queryFn: () => getCoupon(id),
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
      toast.success('Coupon created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coupon> }) => updateCoupon(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY, id] });
      toast.success('Coupon updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
      toast.success('Coupon deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
};

export const useBulkDeleteCoupons = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteCoupons(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
            toast.success('Coupons deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete coupons');
        },
    });
};

export const useBulkUpdateCouponsStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: string[], status: 'ACTIVE' | 'INACTIVE' }) => bulkUpdateCouponsStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
            toast.success('Coupons status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update coupons status');
        },
    });
};
