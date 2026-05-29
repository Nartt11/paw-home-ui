import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Yêu cầu liên kết đặt lại mật khẩu qua email để nhanh chóng lấy lại quyền truy cập tài khoản Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
