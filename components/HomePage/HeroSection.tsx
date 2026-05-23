import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { PrimaryCta } from "@/components/marketing/PrimaryCta";
import { APP_ROUTES } from "@/constants/routes";
import { getBannerHref } from "@/lib/banner";
import type { Banner } from "@/types/banner.type";
import type { PublicPageData } from "@/types/public-page.type";

const HERO_IMG =
  "https://images.unsplash.com/photo-1638552758613-0a9a70102bdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600";

interface HeroSectionProps {
  hero: PublicPageData["hero"];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  banner?: Banner;
}

export default function HeroSection({
  hero,
  searchQuery,
  onSearchChange,
  banner,
}: HeroSectionProps) {
  const primaryHref = getBannerHref(banner, APP_ROUTES.ADOPTION);

  return (
    <PageHero
      imageSrc={banner?.mediaUrl || HERO_IMG}
      imageAlt={banner?.title || hero.titleHighlight}
      className="bg-slate-950"
      minHeightClassName="min-h-screen"
      imageClassName="object-[50%_30%]"
      overlayClassName="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%),linear-gradient(135deg,rgba(2,23,31,0.88)_0%,rgba(3,53,79,0.78)_50%,rgba(2,23,31,0.7)_100%)]"
      containerClassName="max-w-7xl pb-20"
      contentClassName="max-w-xl"
      badge={
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-400/15 px-4 py-1.5 text-[12px] font-semibold text-orange-300">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-400" />
          {hero.emergencyCases} ca cứu hộ khẩn cấp đang cần hỗ trợ hôm nay
        </div>
      }
      title={
        banner?.title ? (
          <h1 className="max-w-3xl whitespace-pre-line text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {banner.title}
          </h1>
        ) : (
          <h1 className="text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Moi chu thu cung
            <br />
            <span className="bg-linear-to-r from-[#FF9132] to-[#F7DB47] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </h1>
        )
      }
      description={
        <p className="max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          {banner?.subtitle || hero.description}
        </p>
      }
      actions={
        <>
          <PrimaryCta href={primaryHref} variant="warm">
            {banner ? "Kham pha ngay" : "Nhan nuoi ngay"}
            <ArrowRight size={18} />
          </PrimaryCta>
          <PrimaryCta href={APP_ROUTES.MAP} variant="glass">
            Ban do cuu ho
          </PrimaryCta>
        </>
      }
    >
      <div className="mb-8 mt-9 flex max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
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
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <PrimaryCta
          href={APP_ROUTES.ADOPTION}
          variant="ocean"
          className="rounded-none px-5 py-3.5 shadow-none"
        >
          Tìm kiếm
          <ArrowRight size={16} />
        </PrimaryCta>
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
    </PageHero>
  );
}
