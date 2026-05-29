import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xác thực tài khoản",
  description: "Xác thực địa chỉ email của bạn để kích hoạt đầy đủ tính năng và bảo mật tài khoản Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
