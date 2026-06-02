"use client";

import Footer from "@/components/PublicLayout/Footer";
import Header from "@/components/Header/Header";
import React from "react";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMapPage = pathname === "/ban-do";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-1 bg-muted text-foreground">{children}</main>
      {!isMapPage && <Footer />}
    </div>
  );
}
