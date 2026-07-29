// features/marketing/hooks/useSmsCampaigns.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSmsCampaigns,
  createSmsCampaign,
  updateSmsCampaign,
  deleteSmsCampaign,
} from '@/services/marketingService';
import { SmsCampaign } from '@/types/marketing';
import { toast } from 'sonner';

const SMS_CAMPAIGNS_QUERY_KEY = 'smsCampaigns';

export const useGetSmsCampaigns = (params: any) => {
  return useQuery({
    queryKey: [SMS_CAMPAIGNS_QUERY_KEY, params],
    queryFn: () => getSmsCampaigns(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateSmsCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SmsCampaign>) => createSmsCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SMS_CAMPAIGNS_QUERY_KEY] });
      toast.success('SMS campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create SMS campaign');
    },
  });
};

export const useUpdateSmsCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SmsCampaign> }) => updateSmsCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [SMS_CAMPAIGNS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SMS_CAMPAIGNS_QUERY_KEY, id] });
      toast.success('SMS campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update SMS campaign');
    },
  });
};

export const useDeleteSmsCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSmsCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SMS_CAMPAIGNS_QUERY_KEY] });
      toast.success('SMS campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete SMS campaign');
    },
  });
};
