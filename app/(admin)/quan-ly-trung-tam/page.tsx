"use client";

import { useCallback, useState } from "react";

import { DeleteModal } from "@/components/common/admin/DeleteModal";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
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
} from "@/hooks/use-organization";
import type { OrganizationCreatePayload } from "@/types/organization.type";
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
        setOpenDelete(false);
        setDeleteId(null);
      },
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
        title="Xóa trung tâm"
        description="Bạn có chắc chắn muốn xóa trung tâm này? Hành động này không thể hoàn tác."
        warningText="Lưu ý: Đây là xóa mềm (deactivate)."
        confirmText="Xóa"
        confirming={deactivateOrganizationMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
