import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang cá nhân",
  description: "Thông tin tài khoản cá nhân, phân quyền và lịch sử hoạt động tác vụ quản trị.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
