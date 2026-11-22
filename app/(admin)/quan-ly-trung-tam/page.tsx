"use client";

import { useCallback, useState } from "react";

import { DeleteModal } from "@/components/common/admin/DeleteModal";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { OrganizationAccountDialog } from "@/components/organization/OrganizationAccountDialog";
import { OrganizationFormDialog } from "@/components/organization/OrganizationFormDialog";
import { OrganizationListTable } from "@/components/organization/OrganizationListTable";
import { OrganizationViewDetail } from "@/components/organization/OrganizationViewDetail";
import {
  getOptionalSearchParam,
  useListUrlState,
} from "@/hooks/use-list-url-state";
import {
  useCreateOrganization,
  useDeactivateOrganization,
  useOrganizationDetail,
  useOrganizations,
  useUpdateOrganization,
  useUpdateOrganizationStatus,
} from "@/hooks/use-organization";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORGANIZATION_STATUS_LABEL } from "@/lib/organization-display";
import type { OrganizationCreatePayload, OrganizationStatus } from "@/types/organization.type";

/** Pending first: it is the queue an admin works through. */
const STATUS_TABS: OrganizationStatus[] = ["PENDING", "ACTIVE", "INACTIVE", "REJECTED"];
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PageControls } from "@/components/common/PageControl";

export default function CenterManagementPage() {
  const { searchParams, page, size, setParams, setPage, setSize } =
    useListUrlState();

  const statusParam = getOptionalSearchParam(searchParams.get("status"));
  const keyword = getOptionalSearchParam(searchParams.get("keyword")) ?? "";
  const status = statusParam ? [statusParam] : undefined;

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [accountOrgId, setAccountOrgId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const organizationsQuery = useOrganizations({
    page,
    pageSize: size,
    status,
  });
  const organizationDetailQuery = useOrganizationDetail(
    selectedId ?? undefined,
  );
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deactivateOrganizationMutation = useDeactivateOrganization();
  const statusMutation = useUpdateOrganizationStatus();

  const nameOf = (id: string) => data?.content.find((o) => o.organizationId === id)?.name ?? "Trung tâm";

  const handleApprove = (id: string) => {
    statusMutation.mutate(
      { id, status: "ACTIVE" },
      {
        onSuccess: () => toast.success(`Đã duyệt ${nameOf(id)}. Người đăng ký trở thành chủ sở hữu.`),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleConfirmReject = () => {
    if (!rejectId) return;
    statusMutation.mutate(
      { id: rejectId, status: "REJECTED" },
      {
        onSuccess: () => {
          toast.success(`Đã từ chối đăng ký của ${nameOf(rejectId)}`);
          setRejectId(null);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const data = organizationsQuery.data;
  const selectedOrganization = organizationDetailQuery.data ?? null;

  const handleCreateOrganization = useCallback(
    (payload: OrganizationCreatePayload) => {
      createOrganizationMutation.mutate(payload, {
        onSuccess: () => {
          setOpenCreate(false);
          toast.success("Tạo trung tâm thành công");
        },
        onError: (error) => toast.error(error.message),
      });
    },
    [createOrganizationMutation],
  );

  const handleUpdateOrganization = useCallback(
    (payload: OrganizationCreatePayload) => {
      if (!selectedId) return;

      updateOrganizationMutation.mutate(
        {
          id: selectedId,
          payload,
        },
        {
          onSuccess: () => {
            setOpenUpdate(false);
            setSelectedId(null);
            toast.success("Cập nhật trung tâm thành công");
          },
          onError: (error) => toast.error(error.message),
        },
      );
    },
    [selectedId, updateOrganizationMutation],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return;

    deactivateOrganizationMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Đã ngừng hoạt động trung tâm");
        setOpenDelete(false);
        setDeleteId(null);
      },
      onError: (error) => toast.error(error.message),
    });
  }, [deactivateOrganizationMutation, deleteId]);

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý trung tâm"
        description="Hệ thống các mái ấm và cơ sở cứu hộ động vật đối tác"
        buttonText="Thêm trung tâm"
        handleOpenModal={() => setOpenCreate(true)}
      />

      <Tabs
        value={statusParam ?? "ALL"}
        onValueChange={(value) => setParams({ status: value === "ALL" ? undefined : value, page: 0 })}
      >
        <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 sm:mx-0 sm:px-0">
          <TabsList>
            <TabsTrigger value="ALL">Tất cả</TabsTrigger>
            {STATUS_TABS.map((value) => (
              <TabsTrigger key={value} value={value}>
                {ORGANIZATION_STATUS_LABEL[value]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="relative w-full md:max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Tìm tổ chức..."
          value={keyword}
          onChange={(e) => setParams({ keyword: e.target.value, page: 0 })}
          className="pl-9"
        />
      </div>

      <OrganizationListTable
        data={data?.content ?? []}
        loading={organizationsQuery.isPending}
        onApprove={handleApprove}
        onReject={setRejectId}
        onCreateAccount={(organizationId) => setAccountOrgId(organizationId)}
        onViewDetail={(organizationId) => {
          setSelectedId(organizationId);
          setOpenDetail(true);
        }}
        onEdit={(organizationId) => {
          setSelectedId(organizationId);
          setOpenUpdate(true);
        }}
        onDelete={(organizationId) => {
          setDeleteId(organizationId);
          setOpenDelete(true);
        }}
        
      />

      <PageControls
        page={page}
        pageSize={size}
        totalPages={data?.totalPages || 0}
        totalItems={data?.totalElements}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      {selectedOrganization && (
        <OrganizationViewDetail
          open={openDetail}
          onOpenChange={(open) => {
            setOpenDetail(open);
            if (!open) {
              setSelectedId(null);
            }
          }}
          organization={selectedOrganization}
        />
      )}

      {accountOrgId && (
        <OrganizationAccountDialog
          organizationId={accountOrgId}
          organizationName={
            data?.content.find((o) => o.organizationId === accountOrgId)?.name
          }
          open
          onOpenChange={(open) => !open && setAccountOrgId(null)}
        />
      )}

      <OrganizationFormDialog
        mode="create"
        open={openCreate}
        onOpenChange={setOpenCreate}
        submitting={createOrganizationMutation.isPending}
        onSubmit={handleCreateOrganization}
      />

      <OrganizationFormDialog
        mode="update"
        open={openUpdate}
        loading={organizationDetailQuery.isPending}
        onOpenChange={(open) => {
          setOpenUpdate(open);
          if (!open) {
            setSelectedId(null);
          }
        }}
        organization={selectedOrganization}
        submitting={updateOrganizationMutation.isPending}
        onSubmit={handleUpdateOrganization}
      />

      <DeleteModal
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) {
            setDeleteId(null);
          }
        }}
        title="Ngừng hoạt động trung tâm"
        description="Trung tâm sẽ không còn hiện trên bản đồ và danh sách công khai. Dữ liệu thú cưng, đơn và thành viên vẫn được giữ lại."
        confirmText="Ngừng hoạt động"
        confirming={deactivateOrganizationMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={handleConfirmDelete}
      />

      <DeleteModal
        open={!!rejectId}
        onOpenChange={(open) => !open && setRejectId(null)}
        title="Từ chối đăng ký trung tâm"
        description={rejectId ? `Từ chối đăng ký của "${nameOf(rejectId)}"? Người đăng ký sẽ không trở thành chủ sở hữu.` : undefined}
        confirmText="Từ chối"
        confirming={statusMutation.isPending}
        confirmDisabled={!rejectId}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
