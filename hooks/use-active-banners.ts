"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import bannerService from "@/services/banner/banner";

export function useActiveBanners() {
  return useQuery({
    queryKey: queryKeys.banners.active,
    queryFn: () => bannerService.getActiveBanners(),
    staleTime: 5 * 60 * 1000,
  });
}
