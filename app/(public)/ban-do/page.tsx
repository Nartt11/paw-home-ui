"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import rescueService from "@/services/rescue-case/rescue-case";
import type {
  BoundingBoxConfigDto,
  RescueCaseMapMarkersConfigDto,
} from "@/services/rescue-case/rescue-case-dto";
import type { RescueCaseSummary } from "@/types/rescue-case.type";

const Map = dynamic(() => import("@/components/map-rescue/MapRescue"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <p className="text-gray-600">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function MapRescuePage() {
  const [boundsBox] = useState<BoundingBoxConfigDto>({
    minLat: 8.5,
    maxLat: 23.5,
    minLng: 102.1,
    maxLng: 109.5,
    page: 1,
    size: 100,
  });

  const [boundsMarkers] = useState<RescueCaseMapMarkersConfigDto>({
    minLat: 8.5,
    maxLat: 23.5,
    minLng: 102.1,
    maxLng: 109.5,
  });

  // Query 1: Map markers (lightweight - just lat/lng/priority)
  const { data: mapMarkers = [], isPending: isLoadingMarkers } = useQuery({
    queryKey: ["rescue-case-markers", boundsMarkers],
    queryFn: () => rescueService.getRescueMapMarkers(boundsMarkers),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  // Query 2: Sidebar data (full details)
  const { data: paginatedData, isPending: isLoadingSidebar } = useQuery({
    queryKey: ["rescue-cases-bbox", boundsBox],
    queryFn: () => rescueService.getRescueCasesInBoundingBox(boundsBox),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const rescueCases: RescueCaseSummary[] = useMemo(
    () => paginatedData?.content ?? [],
    [paginatedData],
  );

  const isLoadingCases = isLoadingMarkers || isLoadingSidebar;

  return (
    <div className="flex h-screen">
      {/* Map */}
      <main className="flex-1 overflow-hidden">
        <Map markers={mapMarkers} loading={isLoadingCases} />
      </main>

      {/* Sidebar */}
      <aside className="w-80 border-l bg-white shadow-xl">
        <div className="h-full overflow-y-auto">
          <div className="space-y-4 p-4">
            <h2 className="text-lg font-bold">Ca cứu hộ</h2>
            <p className="text-sm text-gray-500">
              {rescueCases.length} ca cứu hộ được tìm thấy
            </p>

            {isLoadingCases && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-lg bg-gray-200 h-16"
                  />
                ))}
              </div>
            )}

            {!isLoadingCases && rescueCases.length === 0 && (
              <p className="py-4 text-center text-gray-400">
                Không có ca cứu hộ
              </p>
            )}

            {/* Rescue cases list */}
            <div className="space-y-2">
              {rescueCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className="rounded-lg border border-gray-200 p-3 hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-gray-600">
                        {caseItem.caseId}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {caseItem.species}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {caseItem.locationText}
                      </p>
                    </div>
                    <div
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-white ${
                        caseItem.priority === "CRITICAL" ||
                        caseItem.priority === "HIGH"
                          ? "bg-red-500"
                          : caseItem.priority === "NORMAL"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    >
                      {caseItem.priority}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">{caseItem.status}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(caseItem.reportedAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
