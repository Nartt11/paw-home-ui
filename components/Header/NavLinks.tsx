import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  vi: string;
  en: string;
};

type NavLinksProps = {
  mobile?: boolean;
};

const NAV_LINKS: NavItem[] = [
  { href: APP_ROUTES.HOME, vi: "Trang chủ", en: "Home" },
  { href: APP_ROUTES.ADOPTION, vi: "Nhận nuôi", en: "Adopt" },
  { href: APP_ROUTES.COMMUNITY, vi: "Cộng đồng", en: "Community" },
  { href: APP_ROUTES.MAP, vi: "Bản đồ cứu hộ", en: "Rescue Map" },
  // ponytail: hidden until BE has a news source (PostCategory has no NEWS)
  // { href: APP_ROUTES.NEWS, vi: "Tin tức", en: "News" },
  { href: APP_ROUTES.DONATION, vi: "Ủng hộ", en: "Donate" },
  { href: APP_ROUTES.ABOUT_US, vi: "Về chúng tôi", en: "About" },
];

export default function NavLinks({ mobile = false }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className={
        mobile
          ? "flex flex-col gap-1"
          : "hidden lg:flex items-center justify-center gap-1 flex-1"
      }
    >
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              rounded-xl font-semibold transition-all duration-200
              
              ${mobile ? "w-full px-4 py-3 text-sm" : "px-3 py-2 text-[13px]"}

              ${
                active
                  ? "bg-ph-orange/15 text-ph-orange"
                  : `
                    text-white/80
                    hover:bg-white/10
                    hover:text-white
                  `
              }
            `}
          >
            {link.vi}
          </Link>
        );
      })}
    </nav>
  );
}
