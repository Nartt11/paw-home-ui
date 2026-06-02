"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import type {
  OrganizationMapMarker,
  RescueMapMarker,
} from "@/components/map-rescue/MapRescue";
import { OrganizationViewDetail } from "@/components/organization/OrganizationViewDetail";
import {
  RescueCaseCreate,
  type RescueCaseCreateValues,
} from "@/components/rescue-case/RescueCaseCreate";
import { RescueCaseViewDetail } from "@/components/rescue-case/RescueCaseViewDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useOrganizationDetail,
  useOrganizationMapMarkers,
  useOrganizationsInBoundingBox,
} from "@/hooks/use-organization";
import {
  useCreateRescueCase,
  useRescueCaseDetail,
  useRescueCasesInBoundingBox,
  useRescueMapMarkers,
} from "@/hooks/use-rescue-case";
import type { OrganizationSummary } from "@/types/organization.type";
import type {
  RescueCaseBoundingBoxParams,
  RescueCaseMarkers,
  RescueCasePayload,
  RescueCaseSummary,
} from "@/types/rescue-case.type";

const Map = dynamic(() => import("@/components/map-rescue/MapRescue"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <p className="text-gray-600">Đang tải bản đồ...</p>
    </div>
  ),
});

const VIETNAM_BOUNDS: RescueCaseBoundingBoxParams = {
  minLat: 8.5,
  maxLat: 23.5,
  minLng: 102.1,
  maxLng: 109.5,
  page: 0,
  size: 100,
};

const VIETNAM_MARKER_BOUNDS: RescueCaseMarkers = {
  minLat: 8.5,
  maxLat: 23.5,
  minLng: 102.1,
  maxLng: 109.5,
};

function toCreateRescuePayload(
  values: RescueCaseCreateValues,
): RescueCasePayload {
  return {
    ...values,
    imageUrls: [],
    mediaIds: [],
    contactPhone: "",
  };
}

export default function MapRescuePage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [rescueViewOpen, setRescueViewOpen] = useState(false);
  const [organizationViewOpen, setOrganizationViewOpen] = useState(false);
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [zoomToLocation, setZoomToLocation] = useState<{
    latitude: number;
    longitude: number;
    zoom?: number;
    timestamp: number;
  } | null>(null);

  const rescueMarkersQuery = useRescueMapMarkers(VIETNAM_MARKER_BOUNDS);
  const rescueBoundingBoxQuery = useRescueCasesInBoundingBox(VIETNAM_BOUNDS);
  const organizationMarkersQuery = useOrganizationMapMarkers({
    minLat: VIETNAM_BOUNDS.minLat,
    maxLat: VIETNAM_BOUNDS.maxLat,
    minLng: VIETNAM_BOUNDS.minLng,
    maxLng: VIETNAM_BOUNDS.maxLng,
  });
  const organizationBoundingBoxQuery = useOrganizationsInBoundingBox({
    ...VIETNAM_BOUNDS,
  });
  const rescueDetailQuery = useRescueCaseDetail(
    rescueViewOpen ? selectedRescueId ?? undefined : undefined,
  );
  const organizationDetailQuery = useOrganizationDetail(
    organizationViewOpen ? selectedOrganizationId ?? undefined : undefined,
  );
  const createRescueCaseMutation = useCreateRescueCase();

  const rescueCases = useMemo(
    () => rescueBoundingBoxQuery.data?.content ?? [],
    [rescueBoundingBoxQuery.data],
  );
  const organizations = useMemo(
    () => organizationBoundingBoxQuery.data?.content ?? [],
    [organizationBoundingBoxQuery.data],
  );
  const rescueMarkers: RescueMapMarker[] = useMemo(
    () => (rescueMarkersQuery.data ?? []).map((marker) => ({ ...marker })),
    [rescueMarkersQuery.data],
  );
  const organizationMarkers: OrganizationMapMarker[] = useMemo(
    () =>
      (organizationMarkersQuery.data ?? []).map((item) => ({
        organizationId: item.organizationId,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        type: item.type,
        provinceName: item.provinceName,
        wardName: item.wardName,
      })),
    [organizationMarkersQuery.data],
  );
  const rescueCasesNeedingSupport = useMemo(
    () =>
      rescueCases.filter(
        (item) => item.status === "REPORTED" || item.status === "IN_PROGRESS",
      ),
    [rescueCases],
  );

  const totalRescueCases = rescueBoundingBoxQuery.data?.totalElements ?? 0;
  const totalOrganizations =
    organizationBoundingBoxQuery.data?.totalElements ??
    organizationMarkersQuery.data?.length ??
    0;
  const isLoadingMap =
    rescueMarkersQuery.isPending ||
    rescueBoundingBoxQuery.isPending ||
    organizationMarkersQuery.isPending ||
    organizationBoundingBoxQuery.isPending;

  const handleOpenRescueDetail = useCallback((caseId: string) => {
    setSelectedRescueId(caseId);
    setRescueViewOpen(true);
  }, []);

  const handleOpenOrganizationDetail = useCallback((organizationId: string) => {
    setSelectedOrganizationId(organizationId);
    setOrganizationViewOpen(true);
  }, []);

  const handleRescueViewOpenChange = useCallback((open: boolean) => {
    setRescueViewOpen(open);
    if (!open) {
      setSelectedRescueId(null);
    }
  }, []);

  const handleOrganizationViewOpenChange = useCallback((open: boolean) => {
    setOrganizationViewOpen(open);
    if (!open) {
      setSelectedOrganizationId(null);
    }
  }, []);

  const handleCardRescueClick = useCallback(
    (caseId: string) => {
      const marker = rescueMarkers.find((m) => m.caseId === caseId);
      if (marker) {
        setZoomToLocation({
          latitude: marker.latitude,
          longitude: marker.longitude,
          zoom: 16,
          timestamp: Date.now(),
        });
      }
    },
    [rescueMarkers],
  );

  const handleCardOrganizationClick = useCallback(
    (organizationId: string) => {
      const marker = organizationMarkers.find((m) => m.organizationId === organizationId);
      if (marker) {
        setZoomToLocation({
          latitude: marker.latitude,
          longitude: marker.longitude,
          zoom: 16,
          timestamp: Date.now(),
        });
      }
    },
    [organizationMarkers],
  );

  const handleCreateRescueCase = useCallback(
    async (values: RescueCaseCreateValues) => {
      await createRescueCaseMutation.mutateAsync(toCreateRescuePayload(values));
      setCreateOpen(false);
    },
    [createRescueCaseMutation],
  );

  const renderRescueList = useCallback(
    (items: RescueCaseSummary[], emptyMessage: string) => {
      if (isLoadingMap) {
        return [...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-gray-200"
          />
        ));
      }

      if (items.length === 0) {
        return (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        );
      }

      return items.map((caseItem) => (
        <button
          key={caseItem.caseId}
          type="button"
          onClick={() => handleCardRescueClick(caseItem.caseId)}
          className="w-full rounded-xl border border-gray-200 p-4 text-left transition hover:border-orange-400 hover:bg-orange-50"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-xs text-gray-500">
                {caseItem.caseCode || caseItem.caseId}
              </p>
              <p className="mt-1 font-medium text-gray-900">
                {caseItem.species}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {caseItem.locationText}
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
              {caseItem.priority}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>{caseItem.status}</span>
            <span>
              {new Date(caseItem.reportedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </button>
      ));
    },
    [handleCardRescueClick, isLoadingMap],
  );

  const renderOrganizationList = useCallback(
    (items: OrganizationSummary[]) => {
      if (isLoadingMap) {
        return [...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-gray-200"
          />
        ));
      }

      if (items.length === 0) {
        return (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
            Chưa có trung tâm nào trong vùng hiển thị.
          </div>
        );
      }

      return items.map((organization) => (
        <button
          key={organization.organizationId}
          type="button"
          onClick={() =>
            handleCardOrganizationClick(organization.organizationId)
          }
          className="w-full rounded-xl border border-gray-200 p-4 text-left transition hover:border-teal-500 hover:bg-teal-50"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="line-clamp-1 font-medium text-gray-900">
                {organization.name}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {organization.type}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {[
                  organization.streetAddress,
                  organization.wardName,
                  organization.provinceName,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
              {organization.status}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
            <span className="truncate">
              {organization.phone || "Chưa có số điện thoại"}
            </span>
            <span className="truncate text-right">
              {organization.email || "Chưa có email"}
            </span>
          </div>
        </button>
      ));
    },
    [handleCardOrganizationClick, isLoadingMap],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <main className="relative flex-1 overflow-hidden">
        <Map
          rescueMarkers={rescueMarkers}
          organizationMarkers={organizationMarkers}
          loading={isLoadingMap}
          onRescueMarkerClick={handleOpenRescueDetail}
          onOrganizationMarkerClick={handleOpenOrganizationDetail}
          zoomToLocation={zoomToLocation}
        />
        <Button
          type="button"
          size="lg"
          className="absolute bottom-6 right-6 z-20 rounded-full shadow-lg cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-4" />
          Tạo ca cứu hộ
        </Button>
      </main>

      <aside className="w-80 border-l bg-white shadow-xl">
        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Tổng quan khu vực
            </h2>
            <p className="text-sm text-gray-500">
              Xem nhanh ca cứu hộ và trung tâm hỗ trợ trên bản đồ.
            </p>
          </div>

          <Tabs defaultValue="all" className="min-h-0 flex-1 gap-0">
            <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="rescue">Cần hỗ trợ</TabsTrigger>
              <TabsTrigger value="organizations">Trung tâm</TabsTrigger>
            </TabsList>

            <TabsContent
              value="all"
              className="min-h-0 overflow-y-auto p-4"
            >
              <div className="space-y-5">
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Ca cứu hộ
                    </h3>
                    <span className="text-xs text-gray-500">
                      {totalRescueCases} mục
                    </span>
                  </div>
                  <div className="space-y-3">
                    {renderRescueList(
                      rescueCases,
                      "Chưa có ca cứu hộ trong vùng hiển thị.",
                    )}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Trung tâm hỗ trợ
                    </h3>
                    <span className="text-xs text-gray-500">
                      {totalOrganizations} mục
                    </span>
                  </div>
                  <div className="space-y-3">
                    {renderOrganizationList(organizations)}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent
              value="rescue"
              className="min-h-0 overflow-y-auto p-4"
            >
              <div className="space-y-3">
                {renderRescueList(
                  rescueCasesNeedingSupport,
                  "Chưa có ca nào đang cần hỗ trợ trong vùng hiển thị.",
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="organizations"
              className="min-h-0 overflow-y-auto p-4"
            >
              <div className="space-y-3">
                {renderOrganizationList(organizations)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </aside>

      <RescueCaseCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createRescueCaseMutation.isPending}
        onSubmit={handleCreateRescueCase}
      />

      <RescueCaseViewDetail
        open={rescueViewOpen}
        onOpenChange={handleRescueViewOpenChange}
        rescueCase={rescueDetailQuery.data ?? null}
      />

      {organizationDetailQuery.data ? (
        <OrganizationViewDetail
          open={organizationViewOpen}
          onOpenChange={handleOrganizationViewOpenChange}
          organization={organizationDetailQuery.data}
        />
      ) : null}
    </div>
  );
}
