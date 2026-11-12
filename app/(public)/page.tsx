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
import { useOrganizationMapMarkers } from "@/hooks/use-organization";
import { usePets } from "@/hooks/use-pet";
import { useRescueCaseSearch } from "@/hooks/use-rescue-case";

import landingData from "./data.json" assert { type: "json" };

const DATA = landingData as PublicPageData;

const VIETNAM_BOUNDS = { minLat: 8.5, maxLat: 23.5, minLng: 102.1, maxLng: 109.5 };

// Public endpoints only: the admin dashboard figures need ROLE_ADMIN.
// pageSize 1 because only totalElements is read.
function useLiveStats() {
  const rescued = useRescueCaseSearch({ status: ["RESCUED", "CLOSED"], page: 0, pageSize: 1 });
  const adopted = usePets({ status: ["ADOPTED"], page: 0, pageSize: 1 });
  const centres = useOrganizationMapMarkers(VIETNAM_BOUNDS);

  return useMemo(() => {
    const live = [
      rescued.data?.totalElements,
      adopted.data?.totalElements,
      centres.data?.length,
    ];
    // Volunteers have no public source, so that card keeps its copy.
    return DATA.stats.map((stat, i) =>
      live[i] == null ? stat : { ...stat, value: live[i]!, suffix: "" },
    );
  }, [rescued.data, adopted.data, centres.data]);
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const stats = useLiveStats();
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
      <StatsSection stats={stats} />
      <HowItWorksSection steps={DATA.howItWorksSteps} />
      <RescueMapSection stats={DATA.rescueMapStats} />
      <VolunteerSection banner={volunteerBanner} />
    </div>
  );
}
