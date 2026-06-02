import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Tìm hiểu về sứ mệnh, tầm nhìn, đội ngũ sáng lập và hành trình cứu hộ động vật đầy ý nghĩa của Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
