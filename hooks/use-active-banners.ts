"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import bannerService from "@/services/banner";

export function useActiveBanners(targetPage?: string) {
  return useQuery({
    queryKey: [...queryKeys.banners.active, targetPage ?? ""],
    queryFn: () => bannerService.getActiveBanners(targetPage as string),
    enabled: !!targetPage,
    staleTime: 5 * 60 * 1000,
  });
}
