"use client";

import * as React from "react";

import { toast } from "sonner";

import { BannerCreateNew } from "@/components/banner/BannerCreateNew";
import { BannerListTable } from "@/components/banner/BannerListTable";
import { BannerUpdate } from "@/components/banner/BannerUpdate";
import { BannerViewDetail } from "@/components/banner/BannerViewDetail";
import { DeleteModal } from "@/components/common/admin/DeleteModal";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import {
  toBannerPayload,
  type CreateBannerFormValues,
  type UpdateBannerFormValues,
} from "@/lib/schemas/banner";
import {
  useBannerDetail,
  useBanners,
  useCreateBanner,
  useDeleteBanner,
  useToggleBannerActive,
  useUpdateBanner,
} from "@/hooks/use-banner";
import { useListUrlState } from "@/hooks/use-list-url-state";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra";
}

export default function BannerManagementPage() {
  const { page, size, setPage, setSize } = useListUrlState();

  const listQuery = useBanners({ page, pageSize: size });

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const detailQuery = useBannerDetail(selectedId ?? undefined);
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();
  const toggleBannerMutation = useToggleBannerActive();

  const data = listQuery.data;
  const selectedBanner = detailQuery.data ?? null;

  const handleCreateBanner = React.useCallback(
    async (values: CreateBannerFormValues) => {
      try {
        await createBannerMutation.mutateAsync(toBannerPayload(values));

        setCreateOpen(false);
        toast.success("Tạo banner thành công");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [createBannerMutation],
  );

  const handleUpdateBanner = React.useCallback(
    async (values: UpdateBannerFormValues) => {
      if (!selectedId) return;

      try {
        await updateBannerMutation.mutateAsync({
          id: selectedId,
          payload: toBannerPayload(values),
        });

        setEditOpen(false);
        setSelectedId(null);
        toast.success("Cập nhật banner thành công");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [selectedId, updateBannerMutation],
  );

  const handleDeleteBanner = React.useCallback(async () => {
    if (!deleteId) return;

    try {
      await deleteBannerMutation.mutateAsync(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
      toast.success("Xóa banner thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [deleteBannerMutation, deleteId]);

  const handleToggleStatus = React.useCallback(
    async (id: string) => {
      try {
        await toggleBannerMutation.mutateAsync(id);
        toast.success("Cập nhật trạng thái thành công");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [toggleBannerMutation],
  );

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý banner"
        description="Danh sách banner hiển thị trên trang chủ"
        buttonText="Thêm banner"
        handleOpenModal={() => {
          setCreateOpen(true);
        }}
      />

      <BannerListTable
        data={data?.content ?? []}
        loading={listQuery.isPending}
        onViewDetail={(id) => {
          setSelectedId(id);
          setViewOpen(true);
        }}
        onEdit={(id) => {
          setSelectedId(id);
          setEditOpen(true);
        }}
        onToggleActive={handleToggleStatus}
        onDelete={(id) => {
          setDeleteId(id);
          setDeleteOpen(true);
        }}
      />

      <PageControls
        page={data?.page ?? page}
        pageSize={data?.size ?? size}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      <BannerCreateNew
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createBannerMutation.isPending}
        onSubmit={handleCreateBanner}
      />

      <BannerViewDetail
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);

          if (!open) {
            setSelectedId(null);
          }
        }}
        banner={selectedBanner}
      />

      <BannerUpdate
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedId(null);
          }
        }}
        loading={detailQuery.isPending}
        submitting={updateBannerMutation.isPending}
        banner={selectedBanner}
        onSubmit={handleUpdateBanner}
      />

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(open: boolean) => {
          setDeleteOpen(open);

          if (!open) {
            setDeleteId(null);
          }
        }}
        title="Xóa banner"
        description="Bạn có chắc muốn xóa banner này không? Hành động không thể hoàn tác."
        confirming={deleteBannerMutation.isPending}
        onConfirm={handleDeleteBanner}
      />
    </div>
  );
}
