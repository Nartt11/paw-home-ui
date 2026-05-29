import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nhận nuôi thú cưng",
  description: "Khám phá danh sách các bé chó mèo đang tìm mái ấm. Xem thông tin chi tiết và gửi yêu cầu nhận nuôi thú cưng tại Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
