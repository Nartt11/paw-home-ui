import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý cứu trợ",
  description: "Theo dõi tình trạng, điều phối đội ngũ cứu hộ và cập nhật thông tin các ca cứu trợ khẩn cấp.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
