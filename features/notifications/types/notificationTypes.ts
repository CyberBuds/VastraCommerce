export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

export type NotificationStatus = 'pending' | 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'retrying';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationStats {
  totalNotifications: number;
  pendingCount: number;
  queuedCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  emailDelivered: number;
  smsDelivered: number;
  whatsAppDelivered: number;
  pushDelivered: number;
  queueSize: number;
  deliverySuccessRate: number;
  openRate: number;
  clickRate: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  priority: NotificationPriority;
  recipient: string;
  recipientName?: string;
  sender?: string;
  templateId?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  failureReason?: string;
  retryCount: number;
  metadata?: Record<string, string | number | boolean>;
  isPinned?: boolean;
  isArchived?: boolean;
  isStarred?: boolean;
  folder?: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
}

export interface EmailMessage {
  id: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  senderEmail: string;
  senderName: string;
  templateId?: string;
  attachments?: { name: string; size: string; url: string }[];
  scheduledAt?: string;
  status: NotificationStatus;
  createdAt: string;
}

export interface SmsMessage {
  id: string;
  senderId: string;
  recipients: string[];
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
  scheduledAt?: string;
  characterCount: number;
  segmentCount: number;
  status: NotificationStatus;
  createdAt: string;
}

export interface WhatsAppMessage {
  id: string;
  phoneNumber: string;
  templateName: string;
  language: string;
  mediaType?: 'text' | 'image' | 'document' | 'video';
  mediaUrl?: string;
  headerText?: string;
  bodyParams: string[];
  quickReplies?: { id: string; text: string }[];
  callToAction?: { text: string; url: string };
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
}

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  targetType: 'all' | 'topic' | 'segment' | 'users';
  targetValue: string; // e.g. "vip-customers", "order-updates"
  iconUrl?: string;
  imageUrl?: string;
  actionUrl?: string;
  badgeCount?: number;
  scheduledAt?: string;
  deliveredCount?: number;
  clickCount?: number;
  status: NotificationStatus;
}

export interface InAppNotificationConfig {
  id: string;
  title: string;
  content: string;
  type: 'banner' | 'modal' | 'toast' | 'card';
  priority: NotificationPriority;
  targetUserGroup: string;
  iconName: string;
  actionButtonText?: string;
  actionUrl?: string;
  expiresAt: string;
  isDismissible: boolean;
  active: boolean;
  createdAt: string;
}

export interface BroadcastPayload {
  id: string;
  title: string;
  channels: NotificationChannel[];
  targetAudience: string;
  totalRecipients: number;
  subject?: string;
  content: string;
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'cancelled';
  sentBreakdown: Record<NotificationChannel, number>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  code: string;
  channel: NotificationChannel;
  category: 'transactional' | 'marketing' | 'system' | 'security';
  subject?: string;
  body: string;
  variables: string[];
  version: number;
  active: boolean;
  updatedAt: string;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  channels: NotificationChannel[];
  targetAudience: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  scheduledStart: string;
  totalSent: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export interface QueueItem {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  recipient: string;
  queueType: 'pending' | 'retry' | 'dead_letter';
  payloadSummary: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  enqueuedAt: string;
  nextAttemptAt?: string;
}

export interface NotificationLog {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  recipient: string;
  status: NotificationStatus;
  provider: string; // e.g. "SendGrid", "Twilio", "Meta", "FCM"
  providerResponseCode: string;
  providerResponseBody: string;
  retryCount: number;
  latencyMs: number;
  timestamp: string;
}

export interface SubscriberPreference {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  channels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
    inApp: boolean;
  };
  categories: {
    orders: boolean;
    marketing: boolean;
    security: boolean;
    systemAlerts: boolean;
  };
  status: 'opt_in' | 'opt_out' | 'unsubscribed';
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  status: 'active' | 'disabled' | 'failing';
  successRate: number;
  lastTriggeredAt?: string;
  failureCount: number;
}

export interface SystemEvent {
  id: string;
  eventType: 'order.created' | 'payment.success' | 'shipment.dispatched' | 'customer.registered' | 'inventory.low' | 'marketing.campaign';
  category: 'order' | 'payment' | 'shipment' | 'customer' | 'inventory' | 'marketing';
  description: string;
  triggerChannel: NotificationChannel[];
  templateId: string;
  enabled: boolean;
  lastTriggered: string;
  triggeredCount: number;
}

export interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  source: string;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface ProviderHealth {
  providerName: string;
  channel: NotificationChannel;
  status: 'operational' | 'degraded' | 'outage';
  uptime99: number;
  avgLatencyMs: number;
  errorRate: number;
  activeRateLimit: string;
  lastPing: string;
}
