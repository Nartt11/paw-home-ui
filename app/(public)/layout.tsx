"use client";

import Footer from "@/components/PublicLayout/Footer";
import Header from "@/components/Header/Header";
import React from "react";
import { usePathname } from "next/navigation";
import { SkipLink } from "@/components/common/SkipLink";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMapPage = pathname === "/ban-do";

  return (
    <div className="flex flex-col min-h-screen">
      <SkipLink />
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-20 bg-muted text-foreground">{children}</main>
      {!isMapPage && <Footer />}
    </div>
  );
}
