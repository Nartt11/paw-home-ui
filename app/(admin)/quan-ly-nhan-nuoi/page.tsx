"use client";

import { isOrganizationMember } from "@/lib/permission";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdoptionDecisionDialog } from "@/components/adoption/AdoptionDecisionDialog";
import { AdoptionListTable } from "@/components/adoption/AdoptionListTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdoptionViewDetail } from "@/components/adoption/AdoptionViewDetail";
import { ReclaimLogTable } from "@/components/adoption/ReclaimLogTable";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import {
  useAdoptionDetail,
  useAdoptions,
  useApproveAdoption,
  useRejectAdoption,
  useCancelAdoption,
  useCompleteAdoption,
} from "@/hooks/use-adoption";
import { getAuthErrorMessage } from "@/hooks/use-auth";
import { toast } from "sonner";
import type {
  Adoption,
  AdoptionApprovePayload,
  AdoptionRejectPayload,
  AdoptionSummary,
  AdoptionListParams,
  AdoptionStatus,
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
type Tab = "PENDING" | "APPROVED" | "DONE" | "ALL";

/** Queues first; each tab says what is in it. */
const TABS: Array<{ value: Tab; label: string; hint: string }> = [
  { value: "PENDING", label: "Chờ duyệt", hint: "Đơn mới đang chờ trạm quyết định." },
  { value: "APPROVED", label: "Chờ đón", hint: "Đã duyệt, chờ người nhận nuôi đến đón bé." },
  { value: "DONE", label: "Đã xong", hint: "Đã đón về, bị từ chối hoặc đã huỷ." },
  { value: "ALL", label: "Tất cả", hint: "Mọi đơn nhận nuôi." },
];

const TAB_STATUSES: Record<Tab, AdoptionStatus[] | undefined> = {
  PENDING: ["PENDING"],
  APPROVED: ["APPROVED"],
  DONE: ["COMPLETED", "REJECTED", "CANCELED"],
  ALL: undefined,
};

export default function AdoptionManagementPage() {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  // ?open=<id> (from the dashboard's pending tasks) opens that application straight away.
  const router = useRouter();
  const pathname = usePathname();
  const openParam = useSearchParams().get("open");
  const [openDetail, setOpenDetail] = React.useState(Boolean(openParam));
  const [selectedId, setSelectedId] = React.useState<string | null>(openParam);
  const [decisionState, setDecisionState] = React.useState<DecisionState>(null);
  const [tab, setTab] = React.useState<Tab>("PENDING");
  // Completing hands the pet over and cancelling ends the application: both ask first.
  const [confirmState, setConfirmState] = React.useState<{ mode: "complete" | "cancel"; applicationId: string } | null>(null);

  const { data: currentUser } = useCurrentUser();
  // By organization role: some accounts have no MEMBER system role (production demo accounts have none).
  const isOrganizationUser = isOrganizationMember(currentUser);
  const currentOrgId = isOrganizationUser ? currentUser?.organizationId : undefined;

  const canManage = React.useMemo(() => {
    if (!isOrganizationUser) return true; // ADMIN can manage
    return currentUser?.organizationRole === ORGANIZATION_ROLES.OWNER || currentUser?.organizationRole === ORGANIZATION_ROLES.STAFF;
  }, [isOrganizationUser, currentUser?.organizationRole]);

  const adoptionsParams = React.useMemo(() => {
    const params: AdoptionListParams = {
      page,
      pageSize,
      status: TAB_STATUSES[tab],
    };
    if (isOrganizationUser && currentOrgId) {
      params.organizationId = currentOrgId;
    }
    return params;
  }, [page, pageSize, tab, isOrganizationUser, currentOrgId]);

  const pendingParams = React.useMemo(() => {
    const params: AdoptionListParams = {
      page: 0,
      pageSize: 50,
      status: ["PENDING", "APPROVED"],
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
  const cancelMutation = useCancelAdoption();
  const completeMutation = useCompleteAdoption();

  const adoptions = React.useMemo(
    () => adoptionsQuery.data?.content ?? [],
    [adoptionsQuery.data],
  );
  const pendingAdoptions = React.useMemo(
    () => pendingAdoptionsQuery.data?.content ?? [],
    [pendingAdoptionsQuery.data],
  );
  const adoptionDetail = adoptionDetailQuery.data ?? null;

  const pendingCounts = React.useMemo(() => {
    const counts = { PENDING: 0, APPROVED: 0 };
    pendingAdoptions.forEach((item) => {
      if (item.status === "PENDING") counts.PENDING++;
      if (item.status === "APPROVED") counts.APPROVED++;
    });
    return counts;
  }, [pendingAdoptions]);

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
    approveMutation.isPending ||
    rejectMutation.isPending ||
    cancelMutation.isPending ||
    completeMutation.isPending;

  const handleCancelAdoption = React.useCallback(
    async (applicationId: string) => {
      try {
        await cancelMutation.mutateAsync(applicationId);
        toast.success("Hủy đơn nhận nuôi thành công!");
        setOpenDetail(false);
        setSelectedId(null);
      } catch (error) {
        toast.error(getAuthErrorMessage(error, "Hủy đơn nhận nuôi thất bại."));
      }
    },
    [cancelMutation],
  );

  const handleCompleteAdoption = React.useCallback(
    async (applicationId: string) => {
      try {
        await completeMutation.mutateAsync(applicationId);
        toast.success("Hoàn thành nhận nuôi thành công!");
        setOpenDetail(false);
        setSelectedId(null);
      } catch (error) {
        toast.error(getAuthErrorMessage(error, "Hoàn thành nhận nuôi thất bại."));
      }
    },
    [completeMutation],
  );

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
          <Tabs value={tab} onValueChange={(value) => { setTab(value as Tab); setPage(0); }}>
            <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 sm:mx-0 sm:px-0">
              <TabsList>
                {TABS.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                    {item.value === "PENDING" || item.value === "APPROVED" ? (
                      <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs tabular-nums">{pendingCounts[item.value]}</span>
                    ) : null}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
          <p className="text-sm text-muted-foreground">{TABS.find((item) => item.value === tab)?.hint}</p>

          <AdoptionListTable
            data={adoptions}
            loading={adoptionsQuery.isPending}
            onViewDetail={handleViewDetail}
            onApprove={canManage ? handleOpenApprove : undefined}
            onReject={canManage ? handleOpenReject : undefined}
            onComplete={canManage ? (id) => setConfirmState({ mode: "complete", applicationId: id }) : undefined}
            onCancel={canManage ? (id) => setConfirmState({ mode: "cancel", applicationId: id }) : undefined}
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

        <ConfirmDialog
          open={Boolean(confirmState)}
          onOpenChange={(open) => !open && setConfirmState(null)}
          title={confirmState?.mode === "complete" ? "Xác nhận đã đón" : "Huỷ đơn nhận nuôi"}
          description={
            confirmState?.mode === "complete"
              ? "Người nhận nuôi đã đến đón bé? Bé sẽ chuyển sang gia đình mới và lịch hỏi thăm bắt đầu."
              : "Đơn sẽ bị huỷ và bé trở lại danh sách chờ nhà."
          }
          confirmText={confirmState?.mode === "complete" ? "Đã đón" : "Huỷ đơn"}
          destructive={confirmState?.mode === "cancel"}
          confirming={completeMutation.isPending || cancelMutation.isPending}
          onConfirm={async () => {
            if (!confirmState) return;
            if (confirmState.mode === "complete") await handleCompleteAdoption(confirmState.applicationId);
            else await handleCancelAdoption(confirmState.applicationId);
            setConfirmState(null);
          }}
        />

        <ReclaimLogTable organizationId={currentOrgId} />

        <AdoptionViewDetail
          open={openDetail}
          onOpenChange={(nextOpen) => {
            setOpenDetail(nextOpen);
            if (!nextOpen) {
              setSelectedId(null);
              if (openParam) router.replace(pathname);
            }
          }}
          adoption={adoptionDetailQuery.isFetching ? null : adoptionDetail}
          canManage={canManage}
          onApprove={canManage ? handleOpenApprove : undefined}
          onReject={canManage ? handleOpenReject : undefined}
          onCancel={canManage ? handleCancelAdoption : undefined}
          onComplete={canManage ? handleCompleteAdoption : undefined}
        />

        {decisionState ? (
          <AdoptionDecisionDialog
            open={Boolean(decisionState)}
            onOpenChange={handleDecisionOpenChange}
            mode={decisionState.mode}
            submitting={isDecisionSubmitting}
            applicantName={selectedDecisionAdoption?.applicantName ?? selectedDecisionAdoption?.applicantUsername}
            petName={selectedDecisionAdoption?.petName}
            onSubmit={handleSubmitDecision}
          />
        ) : null}
      </div>
    </RequireAuth>
  );
}
