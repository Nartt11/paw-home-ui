import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bản đồ cứu hộ",
  description: "Bản đồ trực quan hiển thị các ca cứu trợ thú cưng cần trợ giúp khẩn cấp và các trung tâm cứu hộ gần bạn nhất.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
