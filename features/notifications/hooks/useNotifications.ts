import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mockStats,
  mockNotifications,
  mockTemplates,
  mockCampaigns,
  mockQueue,
  mockLogs,
  mockSubscribers,
  mockWebhooks,
  mockSystemEvents,
  mockAlerts,
  mockProviderHealth,
} from '../services/notificationApi';
import {
  NotificationItem,
  NotificationTemplate,
  QueueItem,
  SystemAlert,
  SubscriberPreference,
  WebhookEndpoint,
} from '../types/notificationTypes';
import { toast } from 'sonner';

export function useNotificationStats() {
  return useQuery({
    queryKey: ['notification-stats'],
    queryFn: async () => {
      return mockStats;
    },
  });
}

export function useNotificationsList(folder: string = 'inbox') {
  return useQuery({
    queryKey: ['notifications-list', folder],
    queryFn: async () => {
      if (folder === 'all') return mockNotifications;
      return mockNotifications.filter((n) => n.folder === folder || (folder === 'inbox' && !n.folder));
    },
  });
}

export function useNotificationTemplates() {
  return useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => mockTemplates,
  });
}

export function useNotificationCampaigns() {
  return useQuery({
    queryKey: ['notification-campaigns'],
    queryFn: async () => mockCampaigns,
  });
}

export function useNotificationQueue() {
  return useQuery({
    queryKey: ['notification-queue'],
    queryFn: async () => mockQueue,
  });
}

export function useNotificationLogs() {
  return useQuery({
    queryKey: ['notification-logs'],
    queryFn: async () => mockLogs,
  });
}

export function useSubscriberPreferences() {
  return useQuery({
    queryKey: ['notification-subscribers'],
    queryFn: async () => mockSubscribers,
  });
}

export function useWebhookEndpoints() {
  return useQuery({
    queryKey: ['notification-webhooks'],
    queryFn: async () => mockWebhooks,
  });
}

export function useSystemEvents() {
  return useQuery({
    queryKey: ['notification-system-events'],
    queryFn: async () => mockSystemEvents,
  });
}

export function useSystemAlerts() {
  return useQuery({
    queryKey: ['notification-system-alerts'],
    queryFn: async () => mockAlerts,
  });
}

export function useProviderHealth() {
  return useQuery({
    queryKey: ['notification-provider-health'],
    queryFn: async () => mockProviderHealth,
  });
}

// MUTATIONS

export function useSendNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<NotificationItem>) => {
      const newItem: NotificationItem = {
        id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
        title: payload.title || 'Untitled Notification',
        message: payload.message || '',
        channel: payload.channel || 'email',
        status: 'delivered',
        priority: payload.priority || 'normal',
        recipient: payload.recipient || 'user@example.com',
        recipientName: payload.recipientName || 'Recipient',
        sender: payload.sender || 'system@enterprise.io',
        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        deliveredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        retryCount: 0,
        folder: 'sent',
      };
      mockNotifications.unshift(newItem);
      return newItem;
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast.success(`Notification sent successfully to ${newItem.recipient}`);
    },
    onError: () => {
      toast.error('Failed to dispatch notification');
    },
  });
}

export function useRetryQueueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (queueId: string) => {
      const idx = mockQueue.findIndex((q) => q.id === queueId);
      if (idx !== -1) {
        mockQueue[idx].retryCount += 1;
        mockQueue[idx].queueType = 'pending';
      }
      return queueId;
    },
    onSuccess: (queueId) => {
      queryClient.invalidateQueries({ queryKey: ['notification-queue'] });
      toast.success(`Queue item ${queueId} scheduled for retry attempt.`);
    },
  });
}

export function useResolveAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      const alert = mockAlerts.find((a) => a.id === alertId);
      if (alert) {
        alert.status = 'resolved';
        alert.resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
      return alertId;
    },
    onSuccess: (alertId) => {
      queryClient.invalidateQueries({ queryKey: ['notification-system-alerts'] });
      toast.success(`Alert ${alertId} marked as resolved.`);
    },
  });
}
