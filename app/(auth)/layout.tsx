"use client";

import Link from "next/link";

const HERO_IMG =
  "https://images.unsplash.com/photo-1638552758613-0a9a70102bdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="w-full max-w-120 z-10">{children}</div>
    </div>
  );
}
