// features/marketing/hooks/useCampaigns.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '@/services/marketingService';
import { Campaign } from '@/types/marketing';
import { toast } from 'sonner';
import { useMarketingStore } from '@/store/marketingStore';

const CAMPAIGNS_QUERY_KEY = 'campaigns';

export const useGetCampaigns = () => {
  const { campaignFilters } = useMarketingStore();
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, campaignFilters],
    queryFn: () => getCampaigns(campaignFilters),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetCampaign = (id: string) => {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
      toast.success('Campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) => updateCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY, id] });
      toast.success('Campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update campaign');
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
      toast.success('Campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    },
  });
};
