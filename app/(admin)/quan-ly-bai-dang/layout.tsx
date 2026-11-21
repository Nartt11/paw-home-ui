import type { Metadata } from "next";

import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Quản lý bài đăng",
  description: "Kiểm duyệt, chỉnh sửa và quản lý danh sách các bài đăng cứu hộ và thông tin trên hệ thống Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // Admins only: the page calls admin APIs.
  return <RequireAuth allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}>{children}</RequireAuth>;
}
