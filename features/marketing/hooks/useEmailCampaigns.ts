// features/marketing/hooks/useEmailCampaigns.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmailCampaigns,
  getEmailCampaign,
  createEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign,
  sendTestEmail,
} from '@/services/marketingService';
import { EmailCampaign } from '@/types/marketing';
import { toast } from 'sonner';

const EMAIL_CAMPAIGNS_QUERY_KEY = 'emailCampaigns';

export const useGetEmailCampaigns = (params: any) => {
  return useQuery({
    queryKey: [EMAIL_CAMPAIGNS_QUERY_KEY, params],
    queryFn: () => getEmailCampaigns(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetEmailCampaign = (id: string) => {
  return useQuery({
    queryKey: [EMAIL_CAMPAIGNS_QUERY_KEY, id],
    queryFn: () => getEmailCampaign(id),
    enabled: !!id,
  });
};

export const useCreateEmailCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EmailCampaign>) => createEmailCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_CAMPAIGNS_QUERY_KEY] });
      toast.success('Email campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create email campaign');
    },
  });
};

export const useUpdateEmailCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailCampaign> }) => updateEmailCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_CAMPAIGNS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EMAIL_CAMPAIGNS_QUERY_KEY, id] });
      toast.success('Email campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update email campaign');
    },
  });
};

export const useDeleteEmailCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmailCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_CAMPAIGNS_QUERY_KEY] });
      toast.success('Email campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete email campaign');
    },
  });
};

export const useSendTestEmail = () => {
    return useMutation({
        mutationFn: ({ id, email }: { id: string; email: string }) => sendTestEmail(id, email),
        onSuccess: () => {
            toast.success('Test email sent successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send test email');
        },
    });
};
