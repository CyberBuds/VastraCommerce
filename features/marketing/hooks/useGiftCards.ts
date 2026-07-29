// features/marketing/hooks/useGiftCards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGiftCards,
  getGiftCard,
  createGiftCard,
  updateGiftCard,
  deleteGiftCard,
} from '@/services/marketingService';
import { GiftCard } from '@/types/marketing';
import { toast } from 'sonner';
import { useMarketingStore } from '@/store/marketingStore';

const GIFT_CARDS_QUERY_KEY = 'giftCards';

export const useGetGiftCards = () => {
  const { giftCardFilters } = useMarketingStore();
  return useQuery({
    queryKey: [GIFT_CARDS_QUERY_KEY, giftCardFilters],
    queryFn: () => getGiftCards(giftCardFilters),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetGiftCard = (id: string) => {
  return useQuery({
    queryKey: [GIFT_CARDS_QUERY_KEY, id],
    queryFn: () => getGiftCard(id),
    enabled: !!id,
  });
};

export const useCreateGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<GiftCard, 'id' | 'createdAt' | 'updatedAt' | 'balance' | 'transactions' | 'status'>) => createGiftCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GIFT_CARDS_QUERY_KEY] });
      toast.success('Gift card created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create gift card');
    },
  });
};

export const useUpdateGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GiftCard> }) => updateGiftCard(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [GIFT_CARDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GIFT_CARDS_QUERY_KEY, id] });
      toast.success('Gift card updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update gift card');
    },
  });
};

export const useDeleteGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGiftCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GIFT_CARDS_QUERY_KEY] });
      toast.success('Gift card deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete gift card');
    },
  });
};
