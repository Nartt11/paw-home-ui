import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý trung tâm",
  description: "Cấu hình thông tin liên hệ, địa chỉ và hoạt động của các cơ sở cứu trợ trực thuộc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
