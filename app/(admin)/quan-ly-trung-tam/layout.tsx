import type { Metadata } from "next";

import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Quản lý trung tâm",
  description: "Cấu hình thông tin liên hệ, địa chỉ và hoạt động của các cơ sở cứu trợ trực thuộc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // Admins only: the page calls admin APIs.
  return <RequireAuth allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}>{children}</RequireAuth>;
}
