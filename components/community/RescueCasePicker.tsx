"use client";

import * as React from "react";
import Image from "next/image";
import { LocateFixed, PawPrint, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useMyRescueCases,
  useMyRescueClaims,
  useRescueCaseSearch,
} from "@/hooks/use-rescue-case";
import {
  OPEN_RESCUE_STATUSES,
  RESCUE_STATUS_LABEL,
  formatDistance,
  type RescueCaseBrief,
} from "@/lib/rescue-case-display";
import type { RescueCaseSummary } from "@/types/rescue-case.type";

const PAGE = { page: 0, pageSize: 10 };
const NEARBY_RADIUS_METERS = 10000;
const MIN_SEARCH_LENGTH = 2;

type PickerTab = "claims" | "reported" | "nearby" | "search";

export interface RescueCasePickerProps {
  onPick: (rescueCase: RescueCaseBrief) => void;
}

function toBrief(summary: RescueCaseSummary): RescueCaseBrief {
  return {
    caseId: summary.caseId,
    caseCode: summary.caseCode,
    status: summary.status,
    priority: summary.priority,
    species: summary.species,
    locationText: summary.locationText,
    imageUrl: summary.firstImageUrl,
    distanceMeters: summary.distanceMeters,
  };
}

function CaseRows({
  cases,
  loading,
  empty,
  onPick,
}: {
  cases: RescueCaseBrief[];
  loading: boolean;
  empty: string;
  onPick: (rescueCase: RescueCaseBrief) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        {empty}
      </p>
    );
  }

  return (
    <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
      {cases.map((rescueCase) => {
        const distance = formatDistance(rescueCase.distanceMeters);

        return (
          <li key={rescueCase.caseId}>
            <button
              type="button"
              onClick={() => onPick(rescueCase)}
              className="flex w-full items-center gap-3 rounded-lg border bg-background p-2 text-left transition hover:border-orange-300 hover:bg-orange-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {rescueCase.imageUrl ? (
                  <Image
                    src={rescueCase.imageUrl}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <PawPrint className="size-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {[rescueCase.caseCode, rescueCase.species]
                    .filter(Boolean)
                    .join(" · ") || "Ca cứu hộ"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {[rescueCase.locationText, distance && `cách bạn ${distance}`]
                    .filter(Boolean)
                    .join(" · ") || "Chưa có địa điểm"}
                </p>
              </div>
              {rescueCase.status ? (
                <Badge variant="secondary">
                  {RESCUE_STATUS_LABEL[rescueCase.status]}
                </Badge>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Lets a member pick the case their post is about. Only cases that still need help are offered:
 * the backend refuses a link to a finished case.
 */
export function RescueCasePicker({ onPick }: RescueCasePickerProps) {
  const [tab, setTab] = React.useState<PickerTab>("claims");
  const [keyword, setKeyword] = React.useState("");
  const [submittedKeyword, setSubmittedKeyword] = React.useState("");
  const geolocation = useGeolocation();

  const claimsQuery = useMyRescueClaims(tab === "claims");
  const reportedQuery = useMyRescueCases(
    { ...PAGE, status: OPEN_RESCUE_STATUSES },
    tab === "reported",
  );
  const nearbyQuery = useRescueCaseSearch(
    {
      ...PAGE,
      status: OPEN_RESCUE_STATUSES,
      lat: geolocation.coordinates?.lat,
      lng: geolocation.coordinates?.lng,
      distance: NEARBY_RADIUS_METERS,
    },
    tab === "nearby" && !!geolocation.coordinates,
  );
  const searchQuery = useRescueCaseSearch(
    { ...PAGE, status: OPEN_RESCUE_STATUSES, search: submittedKeyword },
    tab === "search" && submittedKeyword.length >= MIN_SEARCH_LENGTH,
  );

  const claimedCases: RescueCaseBrief[] = (claimsQuery.data ?? []).map(
    (claim) => ({ caseId: claim.caseId, caseCode: claim.caseCode }),
  );

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as PickerTab)}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="claims">Đang nhận</TabsTrigger>
        <TabsTrigger value="reported">Tôi đã báo</TabsTrigger>
        <TabsTrigger value="nearby">Gần tôi</TabsTrigger>
        <TabsTrigger value="search">Tìm mã</TabsTrigger>
      </TabsList>

      <TabsContent value="claims" className="mt-3">
        <CaseRows
          cases={claimedCases}
          loading={claimsQuery.isPending}
          empty="Bạn chưa nhận ca nào."
          onPick={onPick}
        />
      </TabsContent>

      <TabsContent value="reported" className="mt-3">
        <CaseRows
          cases={(reportedQuery.data?.content ?? []).map(toBrief)}
          loading={reportedQuery.isPending}
          empty="Bạn chưa báo ca nào còn đang cần giúp."
          onPick={onPick}
        />
      </TabsContent>

      <TabsContent value="nearby" className="mt-3">
        {geolocation.coordinates ? (
          <CaseRows
            cases={(nearbyQuery.data?.content ?? []).map(toBrief)}
            loading={nearbyQuery.isPending}
            empty="Không có ca nào đang cần giúp trong vòng 10 km."
            onPick={onPick}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {geolocation.status === "denied"
                ? "Trình duyệt đang chặn quyền vị trí. Hãy cho phép rồi thử lại, hoặc tìm theo mã ca."
                : geolocation.status === "unavailable"
                  ? "Không lấy được vị trí của bạn. Hãy thử lại hoặc tìm theo mã ca."
                  : "Cho phép dùng vị trí để xem các ca đang cần giúp quanh bạn."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={geolocation.locate}
              disabled={geolocation.status === "locating"}
            >
              <LocateFixed className="size-4" />
              {geolocation.status === "locating"
                ? "Đang lấy vị trí..."
                : "Dùng vị trí của tôi"}
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="search" className="mt-3 space-y-3">
        <div className="flex gap-2">
          <Input
            value={keyword}
            placeholder="Mã ca, loài hoặc địa điểm"
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                setSubmittedKeyword(keyword.trim());
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setSubmittedKeyword(keyword.trim())}
          >
            <Search className="size-4" />
            Tìm
          </Button>
        </div>
        {submittedKeyword.length >= MIN_SEARCH_LENGTH ? (
          <CaseRows
            cases={(searchQuery.data?.content ?? []).map(toBrief)}
            loading={searchQuery.isPending}
            empty="Không tìm thấy ca nào đang cần giúp khớp với từ khoá."
            onPick={onPick}
          />
        ) : (
          <p className="text-xs text-muted-foreground">
            Nhập ít nhất {MIN_SEARCH_LENGTH} ký tự rồi bấm Tìm.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
