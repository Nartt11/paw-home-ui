import type { Metadata } from "next";

import RequireAuth from "@/components/auth/RequireAuth";
import { CatalogManager } from "@/components/common/admin/CatalogManager";
import { SYSTEM_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Quản lý thẻ",
  description: "Tạo và quản lý thẻ phân loại bài đăng trên Paw Home.",
};

export default function Page() {
  return (
    <RequireAuth allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}>
      <CatalogManager resource="tags" />
    </RequireAuth>
  );
}
