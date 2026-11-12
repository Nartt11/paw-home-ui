"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

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
import {
  useLatestNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useUnreadNotificationCount,
} from "@/hooks/use-notification";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notification.type";

function targetRoute(type: AppNotification["type"]) {
  return type.startsWith("ADOPTION_")
    ? APP_ROUTES.ADOPTION_MANAGEMENT
    : APP_ROUTES.RESCUE_CASE_MANAGEMENT;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const unread = useUnreadNotificationCount();
  const latest = useLatestNotifications(open);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const count = unread.data ?? 0;
  const items = latest.data?.content ?? [];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={count ? `${count} thông báo chưa đọc` : "Thông báo"}
        >
          <Bell className="size-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-destructive px-1 text-[10px] leading-4 font-semibold text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between">
          <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
          {count > 0 && (
            <Button
              variant="link"
              size="sm"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              Đánh dấu đã đọc hết
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {latest.isPending ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">Đang tải...</p>
        ) : items.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">Chưa có thông báo</p>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n.notificationId}
              className="flex flex-col items-start gap-0.5"
              onSelect={() => {
                if (!n.readAt) markRead.mutate(n.notificationId);
                router.push(targetRoute(n.type));
              }}
            >
              <span className={cn("text-sm", !n.readAt && "font-semibold")}>{n.title}</span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{n.body}</span>
              <span className="text-[11px] text-muted-foreground">
                {new Date(n.createdAt).toLocaleString("vi-VN")}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
