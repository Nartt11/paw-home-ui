"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Building2, MapPinned, Siren, TriangleAlert, CheckCircle2, User } from "lucide-react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import type {
  OrganizationMapMarker,
  RescueMapMarker,
} from "@/components/map-rescue/MapRescue";
import { OrganizationViewDetail } from "@/components/organization/OrganizationViewDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RescueCaseCreate, type RescueCaseCreateValues } from "@/components/rescue-case/RescueCaseCreate";
import { RescueCaseViewDetail } from "@/components/rescue-case/RescueCaseViewDetail";
import { RescueCompletionCompareDialog } from "@/components/rescue-case/RescueCompletionCompareDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateRescueCase, useRescueCaseDetail, useRescueCasesInBoundingBox, useRescueMapMarkers, useRescueCompletions, useRescueCases } from "@/hooks/use-rescue-case";
import {
  useOrganizationDetail,
  useOrganizationMapMarkers,
  useOrganizationsInBoundingBox,
} from "@/hooks/use-organization";
import type { OrganizationSummary } from "@/types/organization.type";
import type { RescueCaseBoundingBoxParams, RescueCaseMarkers, RescueCasePayload, RescueCaseSummary, RescueCompletion } from "@/types/rescue-case.type";

import { useCurrentUser } from "@/hooks/use-current-user";
import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";
import { set } from "zod";

const Map = dynamic(() => import("@/components/map-rescue/MapRescue"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <p className="text-muted-foreground">Đang tải bản đồ...</p>
    </div>
  ),
});

const VIETNAM_BOUNDS: RescueCaseBoundingBoxParams = {
  minLat: 8.5,
  maxLat: 23.5,
  minLng: 102.1,
  maxLng: 109.5,
  page: 0,
  pageSize: 100,
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

export default function RescueCaseManagementPage() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [rescueViewOpen, setRescueViewOpen] = React.useState(false);
  const [organizationViewOpen, setOrganizationViewOpen] = React.useState(false);
  const [selectedRescueId, setSelectedRescueId] = React.useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = React.useState<string | null>(null);
  const [zoomToLocation, setZoomToLocation] = React.useState<{
    latitude: number;
    longitude: number;
    zoom?: number;
    timestamp: number;
  } | null>(null);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [selectedCompletionCaseId, setSelectedCompletionCaseId] = React.useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null);

  const { data: currentUser } = useCurrentUser();
  const isOrganizationUser = currentUser?.roles.includes("MEMBERSHIP") && !!currentUser?.organizationRole;
  const currentOrgId = isOrganizationUser ? currentUser?.organizationId : undefined;

  const canCreate = React.useMemo(() => {
    if (!isOrganizationUser) return true;
    return currentUser?.organizationRole === ORGANIZATION_ROLES.OWNER || currentUser?.organizationRole === ORGANIZATION_ROLES.STAFF;
  }, [isOrganizationUser, currentUser?.organizationRole]);

  const markerParams = React.useMemo(() => {
    const params: RescueCaseMarkers = { ...VIETNAM_MARKER_BOUNDS };
    if (isOrganizationUser && currentOrgId) {
      params.organizationId = currentOrgId;
    }
    return params;
  }, [isOrganizationUser, currentOrgId]);

  const boundingBoxParams = React.useMemo(() => {
    const params: RescueCaseBoundingBoxParams = { ...VIETNAM_BOUNDS };
    if (isOrganizationUser && currentOrgId) {
      params.organizationId = currentOrgId;
    }
    return params;
  }, [isOrganizationUser, currentOrgId]);

  const rescueMarkersQuery = useRescueMapMarkers(markerParams);
  const rescueBoundingBoxQuery = useRescueCasesInBoundingBox(boundingBoxParams);
  const organizationMarkersQuery = useOrganizationMapMarkers({
    minLat: VIETNAM_BOUNDS.minLat,
    maxLat: VIETNAM_BOUNDS.maxLat,
    minLng: VIETNAM_BOUNDS.minLng,
    maxLng: VIETNAM_BOUNDS.maxLng,
  });
  const organizationBoundingBoxQuery = useOrganizationsInBoundingBox({
    ...VIETNAM_BOUNDS,
  });
  const detailQuery = useRescueCaseDetail(
    rescueViewOpen ? selectedRescueId ?? undefined : undefined,
  );
  const organizationDetailQuery = useOrganizationDetail(
    organizationViewOpen ? selectedOrganizationId ?? undefined : undefined,
  );
  const createRescueCaseMutation = useCreateRescueCase();
  const completionsQuery = useRescueCompletions({ isResolved: false, page: 0, pageSize: 100 });
  const rescueCasesListQuery = useRescueCases({ page: 0, pageSize: 100 });

  const rescueCases = React.useMemo(
    () => rescueBoundingBoxQuery.data?.content ?? [],
    [rescueBoundingBoxQuery.data],
  );
  const allRescueCases = React.useMemo(
    () => rescueCasesListQuery.data?.content ?? [],
    [rescueCasesListQuery.data],
  );
  const organizations = React.useMemo(() => {
    const content = organizationBoundingBoxQuery.data?.content ?? [];
    if (isOrganizationUser && currentOrgId) {
      return content.filter(o => o.organizationId === currentOrgId);
    }
    return content;
  }, [organizationBoundingBoxQuery.data, isOrganizationUser, currentOrgId]);

  const rescueMarkers: RescueMapMarker[] = React.useMemo(
    () => (rescueMarkersQuery.data ?? []).map((marker) => ({ ...marker })),
    [rescueMarkersQuery.data],
  );
  const organizationMarkers: OrganizationMapMarker[] = React.useMemo(() => {
    const markers = (organizationMarkersQuery.data ?? []).map((item) => ({
      organizationId: item.organizationId,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      type: item.type,
      provinceName: item.provinceName,
      wardName: item.wardName,
    }));
    if (isOrganizationUser && currentOrgId) {
      return markers.filter(o => o.organizationId === currentOrgId);
    }
    return markers;
  }, [organizationMarkersQuery.data, isOrganizationUser, currentOrgId]);
  const totalRescueCases = rescueBoundingBoxQuery.data?.totalElements ?? 0;
  const totalOrganizations =
    organizationBoundingBoxQuery.data?.totalElements ??
    organizationMarkersQuery.data?.length ??
    0;
  const criticalCases = rescueCases.filter(
    (item) => item.priority === "CRITICAL" || item.priority === "HIGH",
  ).length;
  const activeCases = rescueCases.filter(
    (item) => item.status === "REPORTED" || item.status === "IN_PROGRESS",
  ).length;

  const handleOpenDetail = React.useCallback((caseId: string) => {
    setSelectedRescueId(caseId);
    setRescueViewOpen(true);
  }, []);

  const handleOpenOrganizationDetail = React.useCallback(
    (organizationId: string) => {
      setSelectedOrganizationId(organizationId);
      setOrganizationViewOpen(true);
    },
    [],
  );

  const handleRescueViewOpenChange = React.useCallback((open: boolean) => {
    setRescueViewOpen(open);
    if (!open) {
      setSelectedRescueId(null);
    }
  }, []);

  const handleOrganizationViewOpenChange = React.useCallback(
    (open: boolean) => {
      setOrganizationViewOpen(open);
      if (!open) {
        setSelectedOrganizationId(null);
      }
    },
    [],
  );

  const handleCardRescueClick = React.useCallback(
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

  const handleCardOrganizationClick = React.useCallback(
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

  const handleCreateRescueCase = React.useCallback(
    async (values: RescueCaseCreateValues) => {
      await createRescueCaseMutation.mutateAsync(toCreateRescuePayload(values));
      setCreateOpen(false);
    },
    [createRescueCaseMutation],
  );

  const isLoadingMap =
    rescueMarkersQuery.isPending ||
    rescueBoundingBoxQuery.isPending ||
    organizationMarkersQuery.isPending ||
    organizationBoundingBoxQuery.isPending;

  const renderRescueList = React.useCallback(
    (items: RescueCaseSummary[], emptyMessage: string) => {
      if (isLoadingMap) {
        return [...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-muted"
          />
        ));
      }

      if (items.length === 0) {
        return (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        );
      }

      return items.map((caseItem) => (
        <button
          key={caseItem.caseId}
          type="button"
          onClick={() => handleCardRescueClick(caseItem.caseId)}
          className="w-full rounded-xl border p-4 text-left transition hover:border-primary hover:bg-muted/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted-foreground">
                {caseItem.caseCode || caseItem.caseId}
              </p>
              <p className="mt-1 font-medium text-foreground">
                {caseItem.species}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {caseItem.locationText}
              </p>
            </div>
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">
              {caseItem.priority}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
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


  const renderOrganizationList = React.useCallback(
    (items: OrganizationSummary[]) => {
      if (isLoadingMap) {
        return [...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-muted"
          />
        ));
      }

      if (items.length === 0) {
        return (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Chưa có trung tâm nào trong vùng hiển thị.
          </div>
        );
      }

      return items.map((organization) => (
        <button
          key={organization.organizationId}
          type="button"
          onClick={() => handleCardOrganizationClick(organization.organizationId)}
          className="w-full rounded-xl border p-4 text-left transition hover:border-primary hover:bg-muted/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="line-clamp-1 font-medium text-foreground">
                {organization.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {organization.type}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {[
                  organization.streetAddress,
                  organization.wardName,
                  organization.provinceName,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">
              {organization.status}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
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
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ]}
    >
      <div className="space-y-6">
        <TitlePerPage
          title="Quản lý ca cứu trợ"
          description="Theo dõi trực quan các ca cứu trợ và tổ chức hỗ trợ trên bản đồ."
          buttonText={canCreate ? "Báo cáo ca cứu trợ mới" : undefined}
          handleOpenModal={() => setCreateOpen(true)}
        />

        {/* Yêu cầu hoàn thành cần duyệt section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">
              Yêu cầu hoàn thành cần phê duyệt
            </h2>
            {completionsQuery.data?.totalElements ? (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-100">
                {completionsQuery.data.totalElements} ca
              </span>
            ) : null}
          </div>

          {completionsQuery.isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : !completionsQuery.data?.content ||
            completionsQuery.data.content.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/10 p-6 flex flex-col items-center justify-center text-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Không có yêu cầu nào cần duyệt
                </p>
                <p className="text-xs">
                  Tất cả các báo cáo hoàn thành cứu hộ đã được xử lý.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {completionsQuery.data.content.map((item) => (
                <button
                  key={item.completionId}
                  type="button"
                  onClick={() => {
                    setSelectedCompletionCaseId(item.completionId);
                    setSelectedCaseId(item.caseId);
                    setCompareOpen(true);
                  }}
                  className="w-full text-left rounded-xl border p-4 hover:border-primary hover:bg-muted/40 transition-all flex flex-col justify-between h-28 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-muted-foreground">
                        Mã ca: {item.caseId.substring(0, 8)}...
                      </p>
                      <p className="mt-1 font-semibold text-foreground text-sm line-clamp-1">
                        {item.rescueNote || "Không có ghi chú"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100">
                      Chờ duyệt
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground w-full border-t pt-2">
                    <span className="truncate max-w-[150px] flex items-center gap-1">
                      <User className="h-3 w-3" /> {item.verifiedByName}
                    </span>
                    <span className="shrink-0">
                      {new Date(item.rescuedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid h-[70vh] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-full overflow-hidden rounded-2xl border bg-card">
            <Map
              className="h-full w-full"
              rescueMarkers={rescueMarkers}
              organizationMarkers={organizationMarkers}
              loading={isLoadingMap}
              onRescueMarkerClick={handleOpenDetail}
              onOrganizationMarkerClick={handleOpenOrganizationDetail}
              zoomToLocation={zoomToLocation}
            />
          </div>

          <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-card">
            <div className="border-b px-5 py-4">
              <h2 className="text-base font-semibold">Ca cứu trợ trong vùng</h2>
              <p className="text-sm text-muted-foreground">
                Chọn một ca để xem chi tiết nhanh.
              </p>
            </div>

            <Tabs defaultValue="all" className="min-h-0 flex-1 gap-0">
              <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="rescue">Ca cần hỗ trợ</TabsTrigger>
                <TabsTrigger value="organizations">Trung tâm</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="min-h-0 overflow-y-auto p-4">
                <div className="space-y-5">
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        Ca cứu trợ
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {totalRescueCases} mục
                      </span>
                    </div>
                    <div className="space-y-3">
                      {renderRescueList(
                        rescueCases,
                        "Chưa có ca cứu trợ trong vùng hiển thị.",
                      )}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        Trung tâm hỗ trợ
                      </h3>
                      <span className="text-xs text-muted-foreground">
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
                    allRescueCases,
                    "Chưa có ca cứu trợ nào cần hỗ trợ.",
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
        </div>

        <RescueCaseCreate
          open={createOpen}
          onOpenChange={setCreateOpen}
          submitting={createRescueCaseMutation.isPending}
          onSubmit={handleCreateRescueCase}
        />

        <RescueCaseViewDetail
          open={rescueViewOpen}
          onOpenChange={handleRescueViewOpenChange}
          rescueCase={detailQuery.data ?? null}
        />

        {organizationDetailQuery.data ? (
          <OrganizationViewDetail
            open={organizationViewOpen}
            onOpenChange={handleOrganizationViewOpenChange}
            organization={organizationDetailQuery.data}
          />
        ) : null}

        <RescueCompletionCompareDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          caseId={selectedCaseId}
          completionId={selectedCompletionCaseId}
        />
      </div>
    </RequireAuth>
  );
}
