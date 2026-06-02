import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý nhận nuôi",
  description: "Tiếp nhận, thẩm định và xử lý các đơn đăng ký nhận nuôi thú cưng từ cộng đồng.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
