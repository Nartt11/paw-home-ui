import type { Metadata } from "next";

import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
  description: "Phân quyền, quản lý tài khoản thành viên, nhân viên cứu hộ, bác sĩ thú y và người dùng cộng đồng.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // Admins only: the page calls admin APIs.
  return <RequireAuth allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}>{children}</RequireAuth>;
}
