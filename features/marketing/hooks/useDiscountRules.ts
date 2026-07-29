// features/marketing/hooks/useDiscountRules.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDiscountRules,
  getDiscountRule,
  createDiscountRule,
  updateDiscountRule,
  deleteDiscountRule,
} from '@/services/marketingService';
import { DiscountRule } from '@/types/marketing';
import { toast } from 'sonner';

const DISCOUNT_RULES_QUERY_KEY = 'discountRules';

export const useGetDiscountRules = (params: any) => {
  return useQuery({
    queryKey: [DISCOUNT_RULES_QUERY_KEY, params],
    queryFn: () => getDiscountRules(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetDiscountRule = (id: string) => {
  return useQuery({
    queryKey: [DISCOUNT_RULES_QUERY_KEY, id],
    queryFn: () => getDiscountRule(id),
    enabled: !!id,
  });
};

export const useCreateDiscountRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<DiscountRule, 'id' | 'createdAt' | 'updatedAt'>) => createDiscountRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_RULES_QUERY_KEY] });
      toast.success('Discount rule created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create discount rule');
    },
  });
};

export const useUpdateDiscountRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DiscountRule> }) => updateDiscountRule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_RULES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_RULES_QUERY_KEY, id] });
      toast.success('Discount rule updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update discount rule');
    },
  });
};

export const useDeleteDiscountRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiscountRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_RULES_QUERY_KEY] });
      toast.success('Discount rule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete discount rule');
    },
  });
};
