import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Nhập mật khẩu mới để khôi phục và bảo mật quyền truy cập tài khoản Paw Home của bạn.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
