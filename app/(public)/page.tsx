"use client";

import { useMemo, useState } from "react";

import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import RescueMapSection from "@/components/HomePage/RescueMapSection";
import StatsSection from "@/components/HomePage/StatsSection";
import VolunteerSection from "@/components/HomePage/VolunteerSection";
import { useActiveBanners } from "@/hooks/use-banner";
import { pickBannerForTargetPage, PUBLIC_BANNER_TARGETS } from "@/lib/banner";
import type { PublicPageData } from "@/types/public-page.type";

import landingData from "./data.json" assert { type: "json" };

const DATA = landingData as PublicPageData;

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const activeBannersQuery = useActiveBanners(PUBLIC_BANNER_TARGETS.HOME);
  const banners = useMemo(() => activeBannersQuery.data ?? [], [activeBannersQuery.data]);

  const volunteerBanner = useMemo(
    () => pickBannerForTargetPage(banners, PUBLIC_BANNER_TARGETS.HOME, 1),
    [banners],
  );

  return (
    <div >
      <HeroSection
        hero={DATA.hero}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <StatsSection stats={DATA.stats} />
      <HowItWorksSection steps={DATA.howItWorksSteps} />
      <RescueMapSection stats={DATA.rescueMapStats} />
      <VolunteerSection banner={volunteerBanner} />
    </div>
  );
}
