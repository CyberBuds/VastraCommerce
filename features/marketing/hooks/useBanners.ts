// features/marketing/hooks/useBanners.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '@/services/marketingService';
import { toast } from 'sonner';

const BANNERS_QUERY_KEY = 'banners';

export const useGetBanners = (params: any) => {
  return useQuery({
    queryKey: [BANNERS_QUERY_KEY, params],
    queryFn: () => getBanners(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
      toast.success('Banner created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create banner');
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
      toast.success('Banner updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update banner');
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
      toast.success('Banner deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete banner');
    },
  });
};
