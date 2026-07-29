// features/marketing/hooks/usePushNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPushNotifications,
  createPushNotification,
  deletePushNotification,
} from '@/services/marketingService';
import { PushNotification } from '@/types/marketing';
import { toast } from 'sonner';

const PUSH_NOTIFICATIONS_QUERY_KEY = 'pushNotifications';

export const useGetPushNotifications = (params: any) => {
  return useQuery({
    queryKey: [PUSH_NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getPushNotifications(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreatePushNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PushNotification>) => createPushNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUSH_NOTIFICATIONS_QUERY_KEY] });
      toast.success('Push notification created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create push notification');
    },
  });
};

export const useDeletePushNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePushNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUSH_NOTIFICATIONS_QUERY_KEY] });
      toast.success('Push notification deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete push notification');
    },
  });
};
