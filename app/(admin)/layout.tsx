import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import RequireAuth from "@/components/auth/RequireAuth";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/common/SkipLink";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s | Paw Home Admin",
    default: "Dashboard | Paw Home Admin",
  },
  description: "Trang quản trị hệ thống cứu trợ và nhận nuôi thú cưng Paw Home.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <RequireAuth
        allowedSystemRoles={["ADMIN"]}
        allowedOrganizationRoles={["OWNER", "STAFF", "MEMBER"]}
      >
        <SkipLink />
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {/* SidebarInset is the <main>; this is where the skip link lands */}
          <div id="main-content" tabIndex={-1} className="mx-6 my-3 md:mx-12 md:my-6">{children}</div>
        </SidebarInset>
      </RequireAuth>
    </SidebarProvider>
  );
}
