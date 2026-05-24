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
import { useUploadTempMedia } from "@/hooks/use-media";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Co loi xay ra";
}

async function resolveBannerMedia(
  values: CreateBannerFormValues | UpdateBannerFormValues,
  uploadTempMedia: ReturnType<typeof useUploadTempMedia>["mutateAsync"],
) {
  if (values.imageFile) {
    return uploadTempMedia({
      file: values.imageFile,
      folder: "temp/banners",
    });
  }

  return {
    mediaId: values.mediaId,
  };
}

export default function BannerManagementPage() {
  const { page, size, setPage, setSize } = useListUrlState();

  const listQuery = useBanners({ page, size });

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
  const uploadTempMediaMutation = useUploadTempMedia();

  const data = listQuery.data;
  const selectedBanner = detailQuery.data ?? null;

  const handleCreateBanner = React.useCallback(
    async (values: CreateBannerFormValues) => {
      try {
        const media = await resolveBannerMedia(
          values,
          uploadTempMediaMutation.mutateAsync,
        );

        await createBannerMutation.mutateAsync(
          toBannerPayload({
            ...values,
            mediaId: media.mediaId,
          }),
        );

        setCreateOpen(false);
        toast.success("Tao banner thanh cong");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [createBannerMutation, uploadTempMediaMutation],
  );

  const handleUpdateBanner = React.useCallback(
    async (values: UpdateBannerFormValues) => {
      if (!selectedId) return;

      try {
        const media = await resolveBannerMedia(
          values,
          uploadTempMediaMutation.mutateAsync,
        );

        await updateBannerMutation.mutateAsync({
          id: selectedId,
          payload: toBannerPayload({
            ...values,
            mediaId: media.mediaId,
          }),
        });

        setEditOpen(false);
        setSelectedId(null);
        toast.success("Cap nhat banner thanh cong");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [selectedId, updateBannerMutation, uploadTempMediaMutation],
  );

  const handleDeleteBanner = React.useCallback(async () => {
    if (!deleteId) return;

    try {
      await deleteBannerMutation.mutateAsync(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
      toast.success("Xoa banner thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [deleteBannerMutation, deleteId]);

  const handleToggleStatus = React.useCallback(
    async (id: string) => {
      try {
        await toggleBannerMutation.mutateAsync(id);
        toast.success("Cap nhat trang thai thanh cong");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [toggleBannerMutation],
  );

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quan ly banner"
        description="Danh sach banner hien thi tren trang chu"
        buttonText="Them banner"
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
        submitting={
          createBannerMutation.isPending || uploadTempMediaMutation.isPending
        }
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
        submitting={
          updateBannerMutation.isPending || uploadTempMediaMutation.isPending
        }
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
        title="Xoa banner"
        description="Ban co chac muon xoa banner nay khong? Hanh dong khong the hoan tac."
        confirming={deleteBannerMutation.isPending}
        onConfirm={handleDeleteBanner}
      />
    </div>
  );
}
