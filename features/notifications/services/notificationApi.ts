import {
  NotificationStats,
  NotificationItem,
  NotificationTemplate,
  NotificationCampaign,
  QueueItem,
  NotificationLog,
  SubscriberPreference,
  WebhookEndpoint,
  SystemEvent,
  SystemAlert,
  ProviderHealth,
} from '../types/notificationTypes';

export const mockStats: NotificationStats = {
  totalNotifications: 0,
  pendingCount: 0,
  queuedCount: 0,
  sentCount: 0,
  deliveredCount: 0,
  readCount: 0,
  failedCount: 0,
  emailDelivered: 0,
  smsDelivered: 0,
  whatsAppDelivered: 0,
  pushDelivered: 0,
  queueSize: 0,
  deliverySuccessRate: 0,
  openRate: 0,
  clickRate: 0,
};

export const mockNotifications: NotificationItem[] = [];
export const mockTemplates: NotificationTemplate[] = [];
export const mockCampaigns: NotificationCampaign[] = [];
export const mockQueue: QueueItem[] = [];
export const mockLogs: NotificationLog[] = [];
export const mockSubscribers: SubscriberPreference[] = [];
export const mockWebhooks: WebhookEndpoint[] = [];
export const mockSystemEvents: SystemEvent[] = [];
export const mockAlerts: SystemAlert[] = [];
export const mockProviderHealth: ProviderHealth[] = [];