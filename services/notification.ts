import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";
import type {
  AppNotification,
  NotificationListParams,
} from "@/types/notification.type";

const notificationService = {
  // GET /api/v1/notifications - mine, newest first
  getMine(params: NotificationListParams) {
    return http.get<PaginatedResponse<AppNotification>>(
      apiEndpoints.notifications.root,
      { params },
    );
  },

  // GET /api/v1/notifications/unread-count
  async getUnreadCount(): Promise<number> {
    const res = await http.get<{ count: number }>(
      apiEndpoints.notifications.unreadCount,
    );
    return res.count;
  },

  // PATCH /api/v1/notifications/{id}/read
  markRead(id: string) {
    return http.patch<void>(apiEndpoints.notifications.read(id));
  },

  // PATCH /api/v1/notifications/read-all
  markAllRead() {
    return http.patch<{ updated: number }>(apiEndpoints.notifications.readAll);
  },
};

export default notificationService;
