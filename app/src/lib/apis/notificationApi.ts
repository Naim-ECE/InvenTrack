import api from '@/lib/api';

export interface NotificationItem {
  _id: string;
  recipient: string;
  type: 'order' | 'stock' | 'approval' | 'system' | 'success' | 'vendor' | 'product';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const notificationApi = {
  getNotifications: async () => {
    const { data } = await api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/api/notifications');
    return data;
  },
  markAsRead: async (id: string) => {
    const { data } = await api.put<{ notification: NotificationItem }>(`/api/notifications/${id}/read`);
    return data.notification;
  },
  markAllAsRead: async () => {
    const { data } = await api.put<{ message: string }>('/api/notifications/read-all');
    return data;
  },
};