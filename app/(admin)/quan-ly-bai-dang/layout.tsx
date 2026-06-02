import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý bài đăng",
  description: "Kiểm duyệt, chỉnh sửa và quản lý danh sách các bài đăng cứu hộ và thông tin trên hệ thống Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
