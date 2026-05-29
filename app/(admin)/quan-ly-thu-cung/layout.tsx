import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý thú cưng",
  description: "Cập nhật hồ sơ, thông tin sức khỏe, tình trạng tiêm chủng và triệt sản của thú cưng tại trung tâm.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
