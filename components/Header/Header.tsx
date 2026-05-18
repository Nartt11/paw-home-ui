"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrentUser } from "@/hooks/use-current-user";
import NavLinks from "./NavLinks";
import NotifBell from "./NotifBell";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = Boolean(currentUser);
  const unread = 2;
  const isDark = false;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const timeoutId = window.setTimeout(() => {
      setMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, isMobile]);

  const isTransparent = !scrolled;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setMenuOpen(false);
    router.replace(APP_ROUTES.HOME);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b bg-primary ${
        isTransparent
          ? "bg-primary border-transparent"
          : "border-white/10 backdrop-blur-md text-primary"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl bg-linear-to-br from-orange-500 to-red-500 shadow-lg">
            Paw
          </div>
          <div className="hidden sm:flex flex-col">
            <div className="text-white text-sm font-bold">PawHome</div>
            <div className="text-white/60 text-xs tracking-wider">
              CUU HO · NHAN NUOI
            </div>
          </div>
        </Link>

        {!isMobile && <NavLinks />}

        <div className={`flex items-center gap-2 ${isMobile ? "gap-3" : ""}`}>
          {!isMobile &&
            (isLoggedIn ? (
              <div className="flex items-center gap-2">
                <NotifBell unread={unread} />
                <Link
                  href={APP_ROUTES.DASHBOARD}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    void handleLogout();
                  }}
                  disabled={logoutMutation.isPending}
                  className="rounded-full border-2 border-white px-4 py-2 text-xs font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
                >
                  {logoutMutation.isPending ? "Dang xuat..." : "Dang xuat"}
                </button>
              </div>
            ) : (
              <Link
                href={APP_ROUTES.LOGIN}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs border-2 border-white font-semibold hover:shadow-lg transition-shadow"
              >
                Tham gia ngay
              </Link>
            ))}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={menuOpen ? "Dong menu" : "Mo menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div className="border-t border-white/10 bg-[#02171F]/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <NavLinks />
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              {isLoggedIn ? (
                <>
                  <NotifBell unread={unread} />
                  <Link
                    href={APP_ROUTES.DASHBOARD}
                    className="flex items-center justify-center w-full px-4 py-2 rounded-lg text-white text-sm font-semibold border border-white/20"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                    disabled={logoutMutation.isPending}
                    className="flex items-center justify-center w-full px-4 py-2 rounded-lg text-white text-sm font-semibold bg-white/10 disabled:opacity-60"
                  >
                    {logoutMutation.isPending ? "Dang xuat..." : "Dang xuat"}
                  </button>
                </>
              ) : (
                <Link
                  href={APP_ROUTES.LOGIN}
                  className="flex items-center justify-center w-full px-4 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-br from-green-500 to-blue-500 hover:shadow-lg transition-shadow"
                >
                  Tham gia ngay
                </Link>
              )}
              <button
                type="button"
                className="w-full p-2 rounded-lg text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                {isDark ? "Sang" : "Toi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
