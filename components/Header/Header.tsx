"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

import NotifBell from "./NotifBell";

type NavItem = {
  href: string;
  label: string;
};

const NAV_LINKS: NavItem[] = [
  {
    href: APP_ROUTES.HOME,
    label: "Trang chủ",
  },
  {
    href: APP_ROUTES.ADOPTION,
    label: "Nhận nuôi",
  },
  {
    href: APP_ROUTES.MAP,
    label: "Bản đồ cứu hộ",
  },
  {
    href: APP_ROUTES.NEWS,
    label: "Tin tức",
  },
  {
    href: APP_ROUTES.DONATION,
    label: "Ủng hộ",
  },
  {
    href: APP_ROUTES.ABOUT_US,
    label: "Về chúng tôi",
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = Boolean(currentUser);
  const unread = 2;
  const isDark = false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();

    setMenuOpen(false);

    router.replace(APP_ROUTES.HOME);
  };

  const handleNavigate = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed z-50 w-full items-center ">
        <div
          className={cn(
            "flex h-16 items-center justify-between border-b transition-all duration-300 md:px-6",
            scrolled
              ? "border-border bg-background/80  shadow-xl backdrop-blur-xl"
              : "border-white/10 bg-primary/90 text-foreground backdrop-blur-md",
          )}
        >
          {/* Logo */}
          <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
            <Link
              href={APP_ROUTES.HOME}
              className="flex shrink-0 items-center gap-3"
              onClick={handleNavigate}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-500 text-sm font-black text-background shadow-lg">
                Paw
              </div>

              <div className="hidden flex-col sm:flex">
                <span className="text-sm font-black text-background">
                  PawHome
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background">
                  Cứu hộ · Nhận nuôi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      " px-3 py-2 text-[13px] font-semibold transition-all duration-200",
                      active
                        ? "bg-ph-orange/15 text-background border-b"
                        : "text-background hover:border-b hover:text-muted-background/10",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              {isLoggedIn ? (
                <>
                  <NotifBell unread={unread} />

                  <Link
                    href={APP_ROUTES.DASHBOARD}
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition hover:bg-muted"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={logoutMutation.isPending}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {logoutMutation.isPending
                      ? "Đang đăng xuất..."
                      : "Đăng xuất"}
                  </button>
                </>
              ) : (
                <Link
                  href={APP_ROUTES.LOGIN}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Tham gia ngay
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {isLoggedIn && <NotifBell unread={unread} />}

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground transition hover:bg-muted/80"
                aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background/95 px-6 pb-6 pt-28 backdrop-blur-xl transition-all duration-300 lg:hidden",
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        {/* Mobile Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigate}
                className={cn(
                  "rounded-2xl px-4 py-4 text-base font-bold transition-all duration-200",
                  active
                    ? "bg-ph-orange/15 text-ph-orange"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Actions */}
        <div className="mt-auto flex flex-col gap-3 pt-8">
          {isLoggedIn ? (
            <>
              <Link
                href={APP_ROUTES.DASHBOARD}
                onClick={handleNavigate}
                className="flex w-full items-center justify-center rounded-2xl border border-border bg-card py-4 text-sm font-bold text-foreground transition hover:bg-muted"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={logoutMutation.isPending}
                className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
              >
                {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </>
          ) : (
            <Link
              href={APP_ROUTES.LOGIN}
              onClick={handleNavigate}
              className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Tham gia ngay
            </Link>
          )}

          <button
            type="button"
            className="w-full rounded-2xl border border-border bg-card py-4 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {isDark ? "Sáng" : "Tối"}
          </button>
        </div>
      </div>
    </>
  );
}
