import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  vi: string;
  en: string;
};

const NAV_LINKS: NavItem[] = [
  { href: `${APP_ROUTES.HOME}`, vi: "Trang chủ", en: "Home" },
  { href: `${APP_ROUTES.ADOPTION}`, vi: "Nhận nuôi", en: "Adopt" },
  { href: `${APP_ROUTES.MAP}`, vi: "Bản đồ cứu hộ", en: "Rescue Map" },
  { href: `${APP_ROUTES.NEWS}`, vi: "Tin tức", en: "News" },
  { href: `${APP_ROUTES.DONATION}`, vi: "Ủng hộ", en: "Donate" },
  { href: `${APP_ROUTES.ABOUT_US}`, vi: "Về chúng tôi", en: "About" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className=" lg:flex items-center gap-0.5 flex-1 justify-center">
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 text-white py-1.5 rounded-lg text-[12px] font-semibold transition
              ${
                active
                  ? "text-ph-orange bg-ph-orange/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
          >
            {link.vi}
          </Link>
        );
      })}
    </nav>
  );
}
