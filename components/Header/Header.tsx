"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import NavLinks from "./NavLinks";
import NotifBell from "./NotifBell";
import { DarkToggle } from "./Toggles";
import { APP_ROUTES } from "@/constants/routes";
import { Button } from "../ui/button";

export default function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // giả lập state (bạn thay bằng context thật)
  const isLoggedIn = false;
  const unread = 2;
  const isDark = false;

  const toggleDark = () => {};

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const closeMenu = () => {
      if (isMobile) {
        setMenuOpen(false);
      }
    };

    closeMenu();
  }, [pathname, isMobile]);
  const isTransparent = !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b bg-primary
      ${
        isTransparent
          ? "bg-primary border-transparent"
          : "border-white/10 backdrop-blur-md text-primary"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl bg-linear-to-br from-orange-500 to-red-500 shadow-lg">
            🐾
          </div>
          <div className="hidden sm:flex flex-col">
            <div className="text-white text-sm font-bold">PawHome</div>
            <div className="text-white/60 text-xs tracking-wider">
              CỨU HỘ · NHẬN NUÔI
            </div>
          </div>
        </Link>

        {/* Nav - Desktop */}

        {!isMobile && <NavLinks />}

        {/* Right Section */}
        <div className={`flex items-center gap-2 ${isMobile ? "gap-3" : ""}`}>
          {/* {!isMobile && <DarkToggle isDark={isDark} toggleDark={toggleDark} />} */}

          {!isMobile &&
            (isLoggedIn ? (
              <NotifBell unread={unread} />
            ) : (
              <Link
                href={APP_ROUTES.LOGIN}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs border-2 border-white font-semibold hover:shadow-lg transition-shadow"
              >
                Tham gia ngay
              </Link>
            ))}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div className="border-t border-white/10 bg-[#02171F]/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <NavLinks />
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              {isLoggedIn ? (
                <NotifBell unread={unread} />
              ) : (
                <Link
                  href={APP_ROUTES.LOGIN}
                  className="flex items-center justify-center w-full px-4 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-br from-green-500 to-blue-500 hover:shadow-lg transition-shadow"
                >
                  Tham gia ngay
                </Link>
              )}
              <button
                onClick={() => toggleDark()}
                className="w-full p-2 rounded-lg text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                {isDark ? "☀️ Sáng" : "🌙 Tối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
