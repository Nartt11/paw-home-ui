"use client";

import { useEffect, useState } from "react";

import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import RescueMapSection from "@/components/HomePage/RescueMapSection";
import StatsSection from "@/components/HomePage/StatsSection";
import VolunteerSection from "@/components/HomePage/VolunteerSection";
import type { PublicPageData } from "@/types/public-page.type";

import landingData from "./data.json" assert { type: "json" };

const DATA = landingData as PublicPageData;

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsPetsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPetsLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-white text-slate-900">
      <HeroSection
        hero={DATA.hero}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <StatsSection stats={DATA.stats} />
      <HowItWorksSection steps={DATA.howItWorksSteps} />
      <RescueMapSection stats={DATA.rescueMapStats} />
      <VolunteerSection />
    </div>
  );
}
