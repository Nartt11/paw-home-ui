"use client";

import * as React from "react";

import { AdoptionDecisionDialog } from "@/components/adoption/AdoptionDecisionDialog";
import { AdoptionListTable } from "@/components/adoption/AdoptionListTable";
import AdoptionRequestList from "@/components/adoption/AdoptionRequestList";
import { AdoptionViewDetail } from "@/components/adoption/AdoptionViewDetail";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import {
  useAdoptionDetail,
  useAdoptions,
  useApproveAdoption,
  useRejectAdoption,
} from "@/hooks/use-adoption";
import type {
  Adoption,
  AdoptionApprovePayload,
  AdoptionRejectPayload,
  AdoptionSummary,
  AdoptionListParams,
} from "@/types/adoption.type";
import { useCurrentUser } from "@/hooks/use-current-user";
import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";

type DecisionState =
  | {
      mode: "approve" | "reject";
      applicationId: string;
    }
  | null;

const DEFAULT_PAGE_SIZE = 10;
const PENDING_PREVIEW_SIZE = 6;

export default function AdoptionManagementPage() {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [decisionState, setDecisionState] = React.useState<DecisionState>(null);

  const { data: currentUser } = useCurrentUser();
  const isOrganizationUser = currentUser?.roles.includes("MEMBERSHIP") && !!currentUser?.organizationRole;
  const currentOrgId = isOrganizationUser ? currentUser?.organizationId : undefined;

  const canManage = React.useMemo(() => {
    if (!isOrganizationUser) return true; // ADMIN can manage
    return currentUser?.organizationRole === ORGANIZATION_ROLES.OWNER || currentUser?.organizationRole === ORGANIZATION_ROLES.STAFF;
  }, [isOrganizationUser, currentUser?.organizationRole]);

  const adoptionsParams = React.useMemo(() => {
    const params: AdoptionListParams = {
      page,
      size: pageSize,
    };
    if (isOrganizationUser && currentOrgId) {
      params.organizationId = currentOrgId;
    }
    return params;
  }, [page, pageSize, isOrganizationUser, currentOrgId]);

  const pendingParams = React.useMemo(() => {
    const params: AdoptionListParams = {
      page: 0,
      size: PENDING_PREVIEW_SIZE,
      status: ["PENDING"],
    };
    if (isOrganizationUser && currentOrgId) {
      params.organizationId = currentOrgId;
    }
    return params;
  }, [isOrganizationUser, currentOrgId]);

  const adoptionsQuery = useAdoptions(adoptionsParams);
  const pendingAdoptionsQuery = useAdoptions(pendingParams);
  const adoptionDetailQuery = useAdoptionDetail(
    openDetail ? selectedId ?? undefined : undefined,
  );
  const approveMutation = useApproveAdoption();
  const rejectMutation = useRejectAdoption();

  const adoptions = React.useMemo(
    () => adoptionsQuery.data?.content ?? [],
    [adoptionsQuery.data],
  );
  const pendingAdoptions = React.useMemo(
    () => pendingAdoptionsQuery.data?.content ?? [],
    [pendingAdoptionsQuery.data],
  );
  const adoptionDetail = adoptionDetailQuery.data ?? null;

  const selectedDecisionAdoption = React.useMemo<
    Adoption | AdoptionSummary | null
  >(() => {
    if (!decisionState) return null;

    if (
      adoptionDetail &&
      adoptionDetail.applicationId === decisionState.applicationId
    ) {
      return adoptionDetail;
    }

    return (
      adoptions.find(
        (item) => item.applicationId === decisionState.applicationId,
      ) ??
      pendingAdoptions.find(
        (item) => item.applicationId === decisionState.applicationId,
      ) ??
      null
    );
  }, [adoptionDetail, adoptions, decisionState, pendingAdoptions]);

  const totalPages = adoptionsQuery.data?.totalPages ?? 1;
  const totalItems = adoptionsQuery.data?.totalElements ?? 0;
  const isDecisionSubmitting =
    approveMutation.isPending || rejectMutation.isPending;

  const handleViewDetail = React.useCallback((applicationId: string) => {
    setSelectedId(applicationId);
    setOpenDetail(true);
  }, []);

  const handleOpenApprove = React.useCallback((applicationId: string) => {
    setDecisionState({
      mode: "approve",
      applicationId,
    });
  }, []);

  const handleOpenReject = React.useCallback((applicationId: string) => {
    setDecisionState({
      mode: "reject",
      applicationId,
    });
  }, []);

  const handleDecisionOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setDecisionState(null);
    }
  }, []);

  const handleSubmitDecision = React.useCallback(
    async (payload: AdoptionApprovePayload | AdoptionRejectPayload) => {
      if (!decisionState) return;

      if (decisionState.mode === "approve") {
        await approveMutation.mutateAsync({
          id: decisionState.applicationId,
          payload: payload as AdoptionApprovePayload,
        });
      } else {
        await rejectMutation.mutateAsync({
          id: decisionState.applicationId,
          payload: payload as AdoptionRejectPayload,
        });
      }

      setDecisionState(null);
    },
    [approveMutation, decisionState, rejectMutation],
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
          title="Quản lý nhận nuôi"
          description="Theo dõi đơn nhận nuôi, xử lý phê duyệt và xem chi tiết hồ sơ."
        />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Đơn chờ xét duyệt
              </h2>
              <p className="text-sm text-muted-foreground">
                Ưu tiên xem nhanh các hồ sơ đang chờ xử lý.
              </p>
            </div>
          </div>

          {pendingAdoptionsQuery.isPending ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-3xl border bg-muted/40"
                />
              ))}
            </div>
          ) : pendingAdoptions.length === 0 ? (
            <div className="rounded-3xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
              Không có đơn nào đang chờ xét duyệt.
            </div>
          ) : (
            <AdoptionRequestList
              adoptionsList={pendingAdoptions}
              onViewDetail={handleViewDetail}
              onApprove={canManage ? handleOpenApprove : undefined}
              onReject={canManage ? handleOpenReject : undefined}
            />
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Tất cả đơn nhận nuôi
            </h2>
            <p className="text-sm text-muted-foreground">
              Danh sách tổng hợp hồ sơ nhận nuôi, hiển thị thông tin pet và người nộp đơn.
            </p>
          </div>

          <AdoptionListTable
            data={adoptions}
            loading={adoptionsQuery.isPending}
            onViewDetail={handleViewDetail}
            onApprove={canManage ? handleOpenApprove : undefined}
            onReject={canManage ? handleOpenReject : undefined}
          />

          <PageControls
            page={page}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 30]}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={(nextSize) => {
              setPageSize(nextSize);
              setPage(0);
            }}
          />
        </section>

        <AdoptionViewDetail
          open={openDetail}
          onOpenChange={(nextOpen) => {
            setOpenDetail(nextOpen);
            if (!nextOpen) {
              setSelectedId(null);
            }
          }}
          adoption={adoptionDetailQuery.isFetching ? null : adoptionDetail}
          onApprove={canManage ? handleOpenApprove : undefined}
          onReject={canManage ? handleOpenReject : undefined}
        />

        {decisionState ? (
          <AdoptionDecisionDialog
            open={Boolean(decisionState)}
            onOpenChange={handleDecisionOpenChange}
            mode={decisionState.mode}
            submitting={isDecisionSubmitting}
            applicantName={selectedDecisionAdoption?.applicantUsername}
            petName={selectedDecisionAdoption?.petName}
            onSubmit={handleSubmitDecision}
          />
        ) : null}
      </div>
    </RequireAuth>
  );
}
