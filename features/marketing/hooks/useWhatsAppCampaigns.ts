// features/marketing/hooks/useWhatsAppCampaigns.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWhatsAppCampaigns,
  createWhatsAppCampaign,
  updateWhatsAppCampaign,
  deleteWhatsAppCampaign,
} from '@/services/marketingService';
import { WhatsAppCampaign } from '@/types/marketing';
import { toast } from 'sonner';

const WHATSAPP_CAMPAIGNS_QUERY_KEY = 'whatsAppCampaigns';

export const useGetWhatsAppCampaigns = (params: any) => {
  return useQuery({
    queryKey: [WHATSAPP_CAMPAIGNS_QUERY_KEY, params],
    queryFn: () => getWhatsAppCampaigns(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateWhatsAppCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WhatsAppCampaign>) => createWhatsAppCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_CAMPAIGNS_QUERY_KEY] });
      toast.success('WhatsApp campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create WhatsApp campaign');
    },
  });
};

export const useUpdateWhatsAppCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WhatsAppCampaign> }) => updateWhatsAppCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_CAMPAIGNS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_CAMPAIGNS_QUERY_KEY, id] });
      toast.success('WhatsApp campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update WhatsApp campaign');
    },
  });
};

export const useDeleteWhatsAppCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWhatsAppCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_CAMPAIGNS_QUERY_KEY] });
      toast.success('WhatsApp campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete WhatsApp campaign');
    },
  });
};
