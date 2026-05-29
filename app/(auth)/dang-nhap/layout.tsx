import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào hệ thống Paw Home để quản lý các hoạt động cứu trợ, nhận nuôi và quyên góp.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
