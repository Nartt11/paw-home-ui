"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/use-notifications";
import { formatRelativeTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notification.type";

/** Where a notification leads: the case, the adoption, the check-in form or the organization's work list. */
export function notificationHref(notification: AppNotification) {
  const data = notification.data ?? {};
  const type = notification.type;
  if (type === "FOLLOWUP_DUE" || type === "FOLLOWUP_REMINDER") {
    return data.token ? `${APP_ROUTES.FOLLOWUP}?token=${encodeURIComponent(data.token)}` : APP_ROUTES.MY_ADOPTIONS;
  }
  if (type === "FOLLOWUP_ALERT") return APP_ROUTES.FOLLOWUP_ALERTS;
  if (type === "RESCUE_COMPLETION_NEEDS_REVIEW") return APP_ROUTES.RESCUE_CASE_MANAGEMENT;
  if (type === "ADOPTION_SUBMITTED") return APP_ROUTES.ADOPTION_MANAGEMENT;
  if (type.startsWith("ADOPTION_")) return APP_ROUTES.MY_ADOPTIONS;
  if (data.caseId) return `${APP_ROUTES.MY_CASES}?case=${data.caseId}`;
  return null;
}

/** The bell in the header: unread count, the latest notifications, and a way to open each one. */
export function NotificationBell({ className }: { className?: string }) {
  const router = useRouter();
  const signedIn = !!useCurrentUser().data;
  const [open, setOpen] = React.useState(false);
  const unreadQuery = useUnreadNotificationCount(signedIn);
  const listQuery = useNotifications(signedIn && open);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (!signedIn) return null;

  const unread = unreadQuery.data ?? 0;
  const notifications = listQuery.data?.content ?? [];

  const openNotification = (notification: AppNotification) => {
    if (!notification.readAt) markRead.mutate(notification.notificationId);
    const href = notificationHref(notification);
    setOpen(false);
    if (href) router.push(href);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative h-10 w-10 rounded-full", className)}
          aria-label={unread > 0 ? `Thông báo, ${unread} chưa đọc` : "Thông báo"}
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold leading-5 text-white tabular-nums">
              {unread > 99 ? "99+" : unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">Thông báo</DropdownMenuLabel>
          {unread > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={(event) => {
                event.preventDefault();
                markAllRead.mutate();
              }}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Đánh dấu đã đọc
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[26rem] overflow-y-auto py-1">
          {listQuery.isPending ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Đang tải...</p>
          ) : notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Chưa có thông báo. Khi có người nhận ca bạn báo hay đơn của bạn có kết quả, bạn sẽ thấy ở đây.
            </p>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.notificationId}
                onSelect={() => openNotification(notification)}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-0.5 rounded-none px-3 py-2.5",
                  !notification.readAt && "bg-primary/5",
                )}
              >
                <div className="flex w-full items-start gap-2">
                  {!notification.readAt ? (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Chưa đọc" />
                  ) : null}
                  <span className="text-sm font-medium leading-snug">{notification.title}</span>
                </div>
                {notification.body ? (
                  <span className="line-clamp-2 text-xs text-muted-foreground">{notification.body}</span>
                ) : null}
                <span className="text-[11px] text-muted-foreground">{formatRelativeTime(notification.createdAt)}</span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
