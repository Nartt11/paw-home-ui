import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý banner",
  description: "Cài đặt và hiển thị các banner truyền thông, chiến dịch nhận nuôi, quyên góp trên trang chủ.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
