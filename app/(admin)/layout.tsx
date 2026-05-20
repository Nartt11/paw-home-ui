import { AppSidebar } from "@/components/app-sidebar";
import RequireAuth from "@/components/auth/RequireAuth";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
      <RequireAuth allowedRoles={["ADMIN", "STAFF", "OWNER", "VET"]}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="mx-6 my-3 md:mx-12 md:my-6">{children}</div>
        </SidebarInset>
      </RequireAuth>
    </SidebarProvider>
  );
}
