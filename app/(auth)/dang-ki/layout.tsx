import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Đăng ký tài khoản Paw Home để tham gia nhận nuôi, gửi yêu cầu cứu trợ và đồng hành cùng cộng đồng yêu thú cưng.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
