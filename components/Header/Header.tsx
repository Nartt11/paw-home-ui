"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Smartphone, Users } from "lucide-react";

import NavLinks from "./NavLinks";
import NotifBell from "./NotifBell";
import { DarkToggle } from "./Toggles";

export default function Header() {
  const pathname = usePathname();

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

  // useEffect(() => {
  //   setMenuOpen(false);
  // }, [pathname]);

  const isHome = pathname === "/";
  const isTransparent = !scrolled;

  return (
    <header
      className={`sticky transition-all duration-300 border-b
      ${
        isTransparent
          ? "bg-primary border-transparent"
          : "border-white/10 backdrop-blur-md bg-[#02171F]/80"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-[#FF9132] to-[#FF584F]">
            🐾
          </div>
          <div>
            <div className="text-white text-[15px] font-extrabold">PawHome</div>
            <div className="text-white/60 text-[9px] tracking-wider">
              CỨU HỘ · NHẬN NUÔI
            </div>
          </div>
        </Link>

        {/* Nav */}
        <NavLinks />

        {/* Right */}
        <div className="hidden lg:flex items-center gap-2">
          <DarkToggle isDark={isDark} toggleDark={toggleDark} />

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-[11px]"
          >
            <Smartphone size={13} /> App
          </Link>

          {isLoggedIn ? (
            <NotifBell unread={unread} />
          ) : (
            <Link
              href="/web/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[12px] font-bold bg-gradient-to-br from-[#2AC789] to-[#06A7E7]"
            >
              <Users size={13} /> Join
            </Link>
          )}
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#02171F]">
          <NavLinks />
        </div>
      )}
    </header>
  );
}
