"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, Settings, LogOut } from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    label: "Bản đồ",
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = Boolean(currentUser);
  const unread = 2; // Keep notification state if mock data is used

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setMobileMenuOpen(false);
      router.replace(APP_ROUTES.HOME);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 shadow-xs backdrop-blur-md"
          : "border-border/40 bg-background/95 backdrop-blur-xs",
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
        {/* Logo Area */}
        <Link
          href={APP_ROUTES.HOME}
          className="flex shrink-0 items-center gap-3 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-500 text-sm font-black text-white shadow-md">
            Paw
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-black text-foreground">PawHome</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Cứu hộ · Nhận nuôi
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 justify-center flex-1">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-sm font-semibold transition-colors duration-200 select-none",
                  active
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions Area */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn && currentUser ? (
            <>
              <NotifBell unread={unread} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-1.5 px-3 rounded-full hover:bg-accent hover:text-accent-foreground cursor-pointer focus-visible:ring-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {currentUser.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {currentUser.fullName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={APP_ROUTES.USER_SETTING}
                      className="flex w-full items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>Xem trang cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {/* TODO: Update proper settings route if available in future */}
                    <Link
                      href={`${APP_ROUTES.USER_SETTING}`}
                      className="flex w-full items-center gap-2 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void handleLogout()}
                    disabled={logoutMutation.isPending}
                    className="flex w-full items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>
                      {logoutMutation.isPending
                        ? "Đang đăng xuất..."
                        : "Đăng xuất"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5 cursor-pointer"
            >
              <Link href={APP_ROUTES.LOGIN}>Tham gia</Link>
            </Button>
          )}
        </div>

        {/* Mobile / Tablet Controls (Hamburger Menu) */}
        <div className="flex lg:hidden items-center gap-3">
          {isLoggedIn && <NotifBell unread={unread} />}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-accent text-foreground cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col p-6">
              <SheetHeader className="text-left pb-4 border-b">
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-red-500 text-xs font-black text-white">
                    Paw
                  </div>
                  <span className="font-bold text-foreground">PawHome</span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1 py-4 flex-1">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Actions Area */}
              <div className="border-t pt-4 flex flex-col gap-3">
                {isLoggedIn && currentUser ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={currentUser.avatarUrl}
                          alt={currentUser.fullName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {currentUser.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {currentUser.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full justify-start rounded-xl cursor-pointer"
                    >
                      <Link href={APP_ROUTES.USER_SETTING} className="flex gap-2">
                        <User className="h-4 w-4" />
                        <span>Xem trang cá nhân</span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full justify-start rounded-xl cursor-pointer"
                    >
                      {/* TODO: Update proper settings route if available in future */}
                      <Link href={APP_ROUTES.USER_SETTING} className="flex gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Cài đặt</span>
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => void handleLogout()}
                      disabled={logoutMutation.isPending}
                      className="w-full justify-start gap-2 rounded-xl cursor-pointer mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>
                        {logoutMutation.isPending
                          ? "Đang đăng xuất..."
                          : "Đăng xuất"}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer"
                  >
                    <Link href={APP_ROUTES.LOGIN}>Tham gia ngay</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
