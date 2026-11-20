import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";
import type { AppNotification, NotificationListParams } from "@/types/notification.type";

const notificationService = {
  getMine(params: NotificationListParams = {}) {
    return http.get<PaginatedResponse<AppNotification>>(apiEndpoints.notifications.root, { params });
  },

  async getUnreadCount() {
    const res = await http.get<{ count: number }>(apiEndpoints.notifications.unreadCount);
    return Number(res?.count ?? 0);
  },

  markRead(id: string) {
    return http.patch<void>(apiEndpoints.notifications.read(id));
  },

  markAllRead() {
    return http.patch<Record<string, number>>(apiEndpoints.notifications.readAll);
  },
};

export default notificationService;
