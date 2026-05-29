import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hồ sơ của tôi",
  description: "Quản lý thông tin cá nhân, lịch sử quyên góp, các đơn nhận nuôi thú cưng và các yêu cầu cứu hộ đã gửi.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
