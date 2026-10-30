import notificationAxios from "../api/notificationAxios";

export interface NotificationItem {
  _id: string;
  eventId: string;
  recipientId: string;
  eventType: "task.assigned";
  taskId: string;
  projectId: string;
  assignedBy: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsResponse {
  message: string;
  data: NotificationItem[];
  pagination: NotificationPagination;
}

export interface UnreadCountResponse {
  message: string;
  data: {
    count: number;
  };
}

export interface MarkAsReadResponse {
  message: string;
  data: NotificationItem;
}

class NotificationService {
  async getNotification(page = 1, limit = 10) {
    const res = await notificationAxios.get("/notifications", { params: { page, limit } });
    return res.data;
  }

  async getUnreadCount(): Promise<number> {
    const res = await notificationAxios.get("/notifications/unread-count");
    return res.data.data.count;
  }

  async markAsRead(notificationId: string) {
    const res = await notificationAxios.patch(`/notifications/${notificationId}/read`);
    return res.data.data;
  }
}

export default new NotificationService();
