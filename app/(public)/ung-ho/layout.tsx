import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ủng hộ quyên góp",
  description: "Chung tay quyên góp và hỗ trợ tài chính cho các hoạt động cứu hộ, chữa trị y tế và nuôi dưỡng chó mèo tại Paw Home.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
