import Footer from "@/components/PublicLayout/Footer";
import Header from "@/components/Header/Header";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
