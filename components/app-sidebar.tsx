"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChartBarIcon,
  CircleHelpIcon,
  CommandIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  Settings2Icon,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";
import { canAccessByRoles } from "@/lib/permission";

const data = {
  navSystem: [
    {
      title: "Dashboard",
      url: `${APP_ROUTES.DASHBOARD}`,
      icon: <LayoutDashboardIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
      allowedOrganizationRoles: [
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ],
    },
    {
      title: "Quản lý thú cưng",
      url: `${APP_ROUTES.PET_MANAGEMENT}`,
      icon: <ListIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
      allowedOrganizationRoles: [
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ],
    },
    {
      title: "Quản lý thành viên",
      url: `${APP_ROUTES.ORGANIZATION_MEMBER_MANAGEMENT}`,
      icon: <FolderIcon />,
      allowedSystemRoles: [],
      allowedOrganizationRoles: [
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
      ],
    },
    {
      title: "Quản lý trung tâm",
      url: `${APP_ROUTES.CENTER_MANAGEMENT}`,
      icon: <ChartBarIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
    },
    {
      title: "Quản lý người dùng",
      url: `${APP_ROUTES.USER_MANAGEMENT}`,
      icon: <FolderIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
    },
    {
      title: "Quản lý bài đăng",
      url: `${APP_ROUTES.POST_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
    },
  ],
  navContent: [
    {
      title: "Quản lý bài tin tức",
      url: `${APP_ROUTES.NEWS_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
    },
    {
      title: "Quản lý banner",
      url: `${APP_ROUTES.BANNER_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
    },
  ],
  navOperation: [
    {
      title: "Quản lý cứu trợ",
      url: `${APP_ROUTES.RESCUE_CASE_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
      allowedOrganizationRoles: [
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ],
    },
    {
      title: "Quản lý nhận nuôi",
      url: `${APP_ROUTES.ADOPTION_MANAGEMENT}`,
      icon: <ListIcon />,
      allowedSystemRoles: [SYSTEM_ROLES.ADMIN],
      allowedOrganizationRoles: [
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: currentUser } = useCurrentUser();

  const sidebarUser = {
    name: currentUser?.fullName?.trim() || currentUser?.username || "Tài khoản",
    email: currentUser?.email || "đang tải...",
    avatar: "",
  };

  const filterNavItems = React.useCallback(
    (items: typeof data.navSystem) => {
      return items.filter((item) =>
        canAccessByRoles({
          userSystemRoles: currentUser?.roles ?? [],
          userOrganizationRole: currentUser?.organizationRole,
          allowedSystemRoles: item.allowedSystemRoles,
          allowedOrganizationRoles: item.allowedOrganizationRoles,
        })
      );
    },
    [currentUser]
  );

  const filteredNavSystem = React.useMemo(() => filterNavItems(data.navSystem), [filterNavItems, data.navSystem]);
  const filteredNavOperation = React.useMemo(() => filterNavItems(data.navOperation), [filterNavItems, data.navOperation]);
  const filteredNavContent = React.useMemo(() => filterNavItems(data.navContent), [filterNavItems, data.navContent]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Paw Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavSystem.length > 0 && (
          <NavMain label="Quản lý hệ thống" items={filteredNavSystem} />
        )}
        {filteredNavOperation.length > 0 && (
          <NavMain label="Hoạt động cứu trợ" items={filteredNavOperation} />
        )}
        {filteredNavContent.length > 0 && (
          <NavMain label="Quản lý nội dung" items={filteredNavContent} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
