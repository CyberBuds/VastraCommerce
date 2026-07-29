// features/marketing/hooks/useAbandonedCarts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAbandonedCarts,
  recoverAbandonedCart,
} from '@/services/marketingService';
import { toast } from 'sonner';

const ABANDONED_CARTS_QUERY_KEY = 'abandonedCarts';

export const useGetAbandonedCarts = (params: any) => {
  return useQuery({
    queryKey: [ABANDONED_CARTS_QUERY_KEY, params],
    queryFn: () => getAbandonedCarts(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useRecoverAbandonedCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recoverAbandonedCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ABANDONED_CARTS_QUERY_KEY] });
      toast.success('Recovery process initiated for abandoned cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to recover abandoned cart');
    },
  });
};
