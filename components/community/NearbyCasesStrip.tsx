"use client";

import { LocateFixed } from "lucide-react";

import { RescueCaseCard } from "@/components/community/RescueCaseCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useRescueCaseSearch } from "@/hooks/use-rescue-case";
import {
  OPEN_RESCUE_STATUSES,
  type RescueCaseBrief,
} from "@/lib/rescue-case-display";

const SHOWN = 3;
const NEARBY_RADIUS_METERS = 10000;

export interface NearbyCasesStripProps {
  onShareCase?: (rescueCase: RescueCaseBrief) => void;
}

/**
 * Open cases placed inside the feed, for people who never open the map. Shows the newest open
 * cases until the reader shares their position, then the nearest ones.
 */
export function NearbyCasesStrip({ onShareCase }: NearbyCasesStripProps) {
  const geolocation = useGeolocation();
  const located = !!geolocation.coordinates;

  const casesQuery = useRescueCaseSearch({
    page: 0,
    pageSize: SHOWN,
    status: OPEN_RESCUE_STATUSES,
    lat: geolocation.coordinates?.lat,
    lng: geolocation.coordinates?.lng,
    distance: located ? NEARBY_RADIUS_METERS : undefined,
  });

  const cases = casesQuery.data?.content ?? [];

  // nothing to show is not worth a box in the middle of the feed
  if (!casesQuery.isPending && cases.length === 0 && !located) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {located ? "Ca gần bạn đang cần giúp" : "Ca đang cần giúp"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {located
              ? "Trong vòng 10 km quanh vị trí của bạn."
              : "Các ca mới nhất chưa có ai xử lý xong."}
          </p>
        </div>
        {!located ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={geolocation.locate}
            disabled={geolocation.status === "locating"}
          >
            <LocateFixed className="size-4" />
            {geolocation.status === "locating" ? "Đang lấy vị trí..." : "Gần tôi"}
          </Button>
        ) : null}
      </div>

      {geolocation.status === "denied" || geolocation.status === "unavailable" ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Không lấy được vị trí của bạn nên đang hiện các ca mới nhất.
        </p>
      ) : null}

      <div className="mt-3 space-y-2">
        {casesQuery.isPending ? (
          [0, 1].map((row) => (
            <Skeleton key={row} className="h-24 w-full rounded-xl" />
          ))
        ) : cases.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            Không có ca nào đang cần giúp trong vòng 10 km.
          </p>
        ) : (
          cases.map((rescueCase) => (
            <RescueCaseCard
              key={rescueCase.caseId}
              rescueCase={{
                caseId: rescueCase.caseId,
                caseCode: rescueCase.caseCode,
                status: rescueCase.status,
                priority: rescueCase.priority,
                species: rescueCase.species,
                locationText: rescueCase.locationText,
                imageUrl: rescueCase.firstImageUrl,
                distanceMeters: rescueCase.distanceMeters,
              }}
              onShare={onShareCase}
            />
          ))
        )}
      </div>
    </section>
  );
}
