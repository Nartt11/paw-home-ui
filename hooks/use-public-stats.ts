import { useQuery } from "@tanstack/react-query";

import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";

/** Real figures for public pages, so they never show numbers someone typed in. */
export interface PublicStats {
  activeCentres: number;
  petsWaiting: number;
  casesReported: number;
  casesRescued: number;
}

async function total(url: string, params: Record<string, unknown>) {
  const page = await http.get<PaginatedResponse<unknown>>(url, { params: { ...params, page: 0, pageSize: 1 } });
  return page.totalElements ?? 0;
}

export function usePublicStats() {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: async (): Promise<PublicStats> => {
      const [centres, petsWaiting, casesReported, casesRescued] = await Promise.all([
        http.get<unknown[]>(apiEndpoints.organizations.map.markers),
        total(apiEndpoints.pets.root, { availableOnly: true }),
        total(apiEndpoints.rescueCases.root, {}),
        total(apiEndpoints.rescueCases.root, { status: "RESCUED" }),
      ]);
      return { activeCentres: centres.length, petsWaiting, casesReported, casesRescued };
    },
    staleTime: 5 * 60 * 1000,
  });
}
