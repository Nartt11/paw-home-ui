import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
  description: "Phân quyền, quản lý tài khoản thành viên, nhân viên cứu hộ, bác sĩ thú y và người dùng cộng đồng.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
