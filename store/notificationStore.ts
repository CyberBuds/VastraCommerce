import { create } from 'zustand';
import { AppNotification } from '@/types/common';

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'High CPU Utilization Warning',
    description: 'Server cluster us-east-1 is experiencing 91% CPU usage.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
  },
  {
    id: 'notif-2',
    title: 'Database Sync Completed',
    description: 'Production catalog catalog-replica synchronized in 14.2 seconds.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 42 * 60000).toISOString(), // 42 mins ago
  },
  {
    id: 'notif-3',
    title: 'New Admin Security Policy',
    description: 'OAuth security settings updated. Two-Factor Authentication mandatory soon.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: SEED_NOTIFICATIONS,

  addNotification: (notif) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  clearNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
