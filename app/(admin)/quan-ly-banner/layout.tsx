import type { Metadata } from "next";

import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Quản lý banner",
  description: "Cài đặt và hiển thị các banner truyền thông, chiến dịch nhận nuôi, quyên góp trên trang chủ.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // Admins only: the page calls admin APIs.
  return <RequireAuth allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}>{children}</RequireAuth>;
}
