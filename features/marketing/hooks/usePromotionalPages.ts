// features/marketing/hooks/usePromotionalPages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPromotionalPages,
  getPromotionalPage,
  createPromotionalPage,
  updatePromotionalPage,
  deletePromotionalPage,
} from '@/services/marketingService';
import { PromotionalPage } from '@/types/marketing';
import { toast } from 'sonner';

const PROMOTIONAL_PAGES_QUERY_KEY = 'promotionalPages';

export const useGetPromotionalPages = (params: any) => {
  return useQuery({
    queryKey: [PROMOTIONAL_PAGES_QUERY_KEY, params],
    queryFn: () => getPromotionalPages(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetPromotionalPage = (id: string) => {
  return useQuery({
    queryKey: [PROMOTIONAL_PAGES_QUERY_KEY, id],
    queryFn: () => getPromotionalPage(id),
    enabled: !!id,
  });
};

export const useCreatePromotionalPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PromotionalPage, 'id' | 'createdAt' | 'updatedAt'>) => createPromotionalPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_PAGES_QUERY_KEY] });
      toast.success('Promotional page created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create promotional page');
    },
  });
};

export const useUpdatePromotionalPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionalPage> }) => updatePromotionalPage(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_PAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_PAGES_QUERY_KEY, id] });
      toast.success('Promotional page updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update promotional page');
    },
  });
};

export const useDeletePromotionalPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePromotionalPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_PAGES_QUERY_KEY] });
      toast.success('Promotional page deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete promotional page');
    },
  });
};
