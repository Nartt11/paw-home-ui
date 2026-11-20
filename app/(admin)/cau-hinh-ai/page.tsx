import type { Metadata } from "next";

import RequireAuth from "@/components/auth/RequireAuth";
import { AiSettings } from "@/components/post/AiSettings";
import { SYSTEM_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Cấu hình AI",
  description: "Chọn model phân tích bài đăng và theo dõi độ chính xác của AI trên Paw Home.",
};

export default function Page() {
  return (
    <RequireAuth allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}>
      <AiSettings />
    </RequireAuth>
  );
}
