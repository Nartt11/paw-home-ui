"use client";

import { NotificationBell } from "@/components/notification/NotificationBell";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_ROUTES } from "@/constants/routes";

/** Section names, matching the sidebar labels. */
const SECTIONS: Array<{ href: string; label: string }> = [
  { href: APP_ROUTES.DASHBOARD, label: "Tổng quan" },
  { href: APP_ROUTES.PET_MANAGEMENT, label: "Quản lý thú cưng" },
  { href: APP_ROUTES.ORGANIZATION_MEMBER_MANAGEMENT, label: "Quản lý thành viên" },
  { href: APP_ROUTES.CENTER_MANAGEMENT, label: "Quản lý trung tâm" },
  { href: APP_ROUTES.USER_MANAGEMENT, label: "Quản lý người dùng" },
  { href: APP_ROUTES.ROLE_MANAGEMENT, label: "Vai trò & quyền" },
  { href: APP_ROUTES.POST_MANAGEMENT, label: "Quản lý bài đăng" },
  { href: APP_ROUTES.TAG_MANAGEMENT, label: "Quản lý thẻ" },
  { href: APP_ROUTES.AI_SETTINGS, label: "Cấu hình AI" },
  { href: APP_ROUTES.BANNER_MANAGEMENT, label: "Quản lý banner" },
  { href: APP_ROUTES.RESCUE_CASE_MANAGEMENT, label: "Quản lý cứu trợ" },
  { href: APP_ROUTES.RESCUE_QUEUE, label: "Hàng chờ cứu hộ" },
  { href: APP_ROUTES.ADOPTION_MANAGEMENT, label: "Quản lý nhận nuôi" },
  { href: APP_ROUTES.FOLLOWUP_ALERTS, label: "Việc sau nhận nuôi" },
  { href: APP_ROUTES.PROFILE, label: "Trang cá nhân" },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const section = SECTIONS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const isDetail = !!section && pathname !== section.href;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" aria-label="Thu gọn hoặc mở thanh bên" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <nav aria-label="Vị trí hiện tại" className="text-base">
          {isDetail ? (
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href={section.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {section.label}
                </Link>
              </li>
              <li aria-hidden className="text-muted-foreground">
                /
              </li>
              <li aria-current="page" className="font-medium">
                Chi tiết
              </li>
            </ol>
          ) : (
            <span aria-current="page" className="font-medium">
              {section?.label ?? "Trang quản lý"}
            </span>
          )}
        </nav>
        <NotificationBell className="ml-auto" />
      </div>
    </header>
  );
}
