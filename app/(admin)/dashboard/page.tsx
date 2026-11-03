import type { Metadata } from "next";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Báo cáo thống kê, biểu đồ hoạt động cứu trợ, nhận nuôi và quyên góp trên hệ thống Paw Home.",
};

export default function Page() {
  return (
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ]}
    >
      <AdminDashboard />
    </RequireAuth>
  );
}
