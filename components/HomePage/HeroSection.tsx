import { PublicPageData } from "@/types/public-page.type";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const HERO_IMG =
  "https://images.unsplash.com/photo-1638552758613-0a9a70102bdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600";

interface HeroSectionProps {
  hero: PublicPageData["hero"];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}
export default function HeroSection({
  hero,
  searchQuery,
  onSearchChange,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="fake"
          className="h-full w-full object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%),linear-gradient(135deg,rgba(2,23,31,0.88)_0%,rgba(3,53,79,0.78)_50%,rgba(2,23,31,0.7)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 ">
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-400/15 px-4 py-1.5 text-[12px] font-semibold text-orange-300">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-400" />
            🆘 {hero.emergencyCases} ca cứu hộ khẩn cấp đang cần hỗ trợ hôm nay
          </div>

          <h1 className="mb-6 text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Mỗi chú thú cưng
            <br />
            <span className="bg-linear-to-r from-[#FF9132] to-[#F7DB47] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </h1>

          <p className="mb-9 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
            {hero.description}
          </p>

          <div className="mb-8 flex max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
              <span className="text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    fill="currentColor"
                    d="M10.5 4a6.5 6.5 0 0 1 5.165 10.43l3.452 3.453a1 1 0 0 1-1.414 1.414l-3.453-3.452A6.5 6.5 0 1 1 10.5 4m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9"
                  />
                </svg>
              </span>
              <input
                className="w-full border-0 bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                placeholder={hero.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Link
              href="/pets"
              className="flex items-center gap-2 bg-linear-to-br from-[#03354F] to-[#064a70] px-5 text-[14px] font-semibold text-white"
            >
              Tìm kiếm
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/pets"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-[#FF9132] to-[#FF584F] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(255,145,50,0.5)]"
            >
              🐾 Nhận nuôi ngay
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/rescues/map"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-md"
            >
              🆘 Bản đồ cứu hộ
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] tracking-[0.25em] text-white/60">
        <div className="h-10 w-px origin-top animate-[scroll_1.8s_infinite] bg-white/40" />
        <span>SCROLL</span>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scaleY(0.5) translateY(20px);
          }
        }
      `}</style>
    </section>
  );
}
