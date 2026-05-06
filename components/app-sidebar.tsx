"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
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
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
} from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSystem: [
    {
      title: "Dashboard",
      url: `${APP_ROUTES.DASHBOARD}`,
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Quản lý thú cưng",
      url: `${APP_ROUTES.PET_MANAGEMENT}`,
      icon: <ListIcon />,
    },
    {
      title: "Quản lý trung tâm",
      url: `${APP_ROUTES.CENTER_MANAGEMENT}`,
      icon: <ChartBarIcon />,
    },
    {
      title: "Quản lý người dùng",
      url: `${APP_ROUTES.USER_MANAGEMENT}`,
      icon: <FolderIcon />,
    },
    {
      title: "Quản lý bài đăng",
      url: `${APP_ROUTES.POST_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
    },
  ],
  navContent: [
    {
      title: "Quản lý bài tin tức",
      url: `${APP_ROUTES.NEWS_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Quản lý banner",
      url: `${APP_ROUTES.BANNER_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
    },
  ],

  navOperation: [
    {
      title: "Quản lý cứu trợ",
      url: `${APP_ROUTES.RESCUE_CASE_MANAGEMENT}`,
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Quản lý nhận nuôi",
      url: `${APP_ROUTES.ADOPTION_MANAGEMENT}`,
      icon: <ListIcon />,
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
        <NavMain label="Quản lý hệ thống" items={data.navSystem} />
        <NavMain label="Hoạt động cứu trợ" items={data.navOperation} />
        <NavMain label="Quản lý nội dung" items={data.navContent} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
