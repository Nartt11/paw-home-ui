"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { PrimaryCta } from "@/components/marketing/PrimaryCta";
import { APP_ROUTES } from "@/constants/routes";
import { useActiveBanners } from "@/hooks/use-banner";
import { PUBLIC_BANNER_TARGETS, getBannerHref } from "@/lib/banner";
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
  const activeBannersQuery = useActiveBanners(PUBLIC_BANNER_TARGETS.HOME);
  const activeHomeBanners = useMemo(
    () =>
      (activeBannersQuery.data ?? [])
        .filter((item) => item.targetPage === PUBLIC_BANNER_TARGETS.HOME)
        .sort((left, right) => left.displayOrder - right.displayOrder),
    [activeBannersQuery.data],
  );
  const heroBanners =
    activeHomeBanners.length > 0 ? activeHomeBanners : banner ? [banner] : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroBanners.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [heroBanners.length]);

  const normalizedIndex =
    heroBanners.length > 0 ? currentIndex % heroBanners.length : 0;
  const currentBanner = heroBanners[normalizedIndex];
  const primaryHref = getBannerHref(currentBanner, APP_ROUTES.ADOPTION);

  return (
    <PageHero
      imageSrc={currentBanner?.mediaUrl || HERO_IMG}
      imageAlt={currentBanner?.title || hero.titleHighlight}
      className="bg-slate-950"
      minHeightClassName="min-h-[75dvh]"
      imageClassName="object-[50%_30%]"
      overlayClassName="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%),linear-gradient(135deg,rgba(2,23,31,0.88)_0%,rgba(3,53,79,0.78)_50%,rgba(2,23,31,0.7)_100%)]"
      containerClassName="max-w-7xl pb-20"
      contentClassName="max-w-7xl"
      badge={
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-400/15 px-4 py-1.5 text-[12px] font-semibold text-orange-300">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-400" />
          {hero.emergencyCases} ca cứu hộ khẩn cấp đang cần hỗ trợ hôm nay
        </div>
      }
      title={
        currentBanner?.title ? (
          <h1 className="max-w-3xl whitespace-pre-line text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {currentBanner.title}
          </h1>
        ) : (
          <h1 className="text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Mỗi chú thú cưng
            <br />
            <span className="bg-linear-to-r from-[#FF9132] to-[#F7DB47] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </h1>
        )
      }
      description={
        <p className="max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          {currentBanner?.subtitle || hero.description}
        </p>
      }
      actions={
        <>
          <PrimaryCta href={primaryHref} variant="warm">
            {currentBanner ? "Khám phá ngay" : "Nhận nuôi ngay"}
            <ArrowRight size={18} />
          </PrimaryCta>
          <PrimaryCta href={APP_ROUTES.MAP} variant="glass">
            Bản đồ cứu hộ
          </PrimaryCta>
        </>
      }
    >
      {heroBanners.length > 1 ? (
        <div className="mt-6 flex items-center gap-2">
          {heroBanners.map((item, index) => (
            <button
              key={item.bannerId}
              type="button"
              aria-label={`Xem banner ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === normalizedIndex
                  ? "w-10 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      ) : null}
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
