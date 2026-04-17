import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  vi: string;
  en: string;
};

const NAV_LINKS: NavItem[] = [
  { href: "/", vi: "Trang chủ", en: "Home" },
  { href: "/adoption", vi: "Nhận nuôi", en: "Adopt" },
  { href: "/ban-do", vi: "Bản đồ cứu hộ", en: "Rescue Map" },
  { href: "/news", vi: "Tin tức", en: "News" },
  { href: "/donate", vi: "Ủng hộ", en: "Donate" },
  { href: "/about", vi: "Về chúng tôi", en: "About" },
];

export default function NavLinks({ lang }: { lang: "vi" | "en" }) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition
              ${
                active
                  ? "text-ph-orange bg-ph-orange/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
          >
            {lang === "en" ? link.en : link.vi}
          </Link>
        );
      })}
    </nav>
  );
}
