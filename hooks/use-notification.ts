import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import notificationService from "@/services/notification";

export const notificationKeys = {
  all: ["notifications"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
  latest: () => [...notificationKeys.all, "latest"] as const,
};

// ponytail: polling every minute; switch to the WebSocket channel if it gets a notification topic.
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60_000,
  });
}

export function useLatestNotifications(enabled: boolean) {
  return useQuery({
    queryKey: notificationKeys.latest(),
    queryFn: () => notificationService.getMine({ page: 0, pageSize: 10 }),
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}
