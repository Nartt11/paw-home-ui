"use client";

import * as React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { BannerListTable } from "@/components/banner/BannerListTable";
import DeleteModal from "@/components/common/DeleteModal";
import { BannerCreateNew } from "@/components/banner/BannerCreateNew";
import type { BannerCreateNewValues } from "@/components/banner/BannerCreateNew";
import { BannerViewDetail } from "@/components/banner/BannerViewDetail";
import { BannerUpdate } from "@/components/banner/BannerUpdate";
import type { BannerUpdateValues } from "@/components/banner/BannerUpdate";

import { useListUrlState } from "@/hooks/use-list-url-state";
import bannerService from "@/services/banner/banner";
import type { Banner } from "@/types/banner.type";

export default function BannerManagementPage() {
  const { page, size, setPage, setSize } = useListUrlState();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["banners", { page, size }],
    queryFn: () => bannerService.getAllBanners({ page, size }),
  });

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const detailQuery = useQuery({
    queryKey: ["banner", selectedId],
    queryFn: () => bannerService.getBannerById(selectedId as string),
    enabled: Boolean(selectedId) && (viewOpen || editOpen),
  });

  const selectedBanner: Banner = detailQuery.data as Banner;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bannerService.deleteBanner(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteOpen(false);
      setDeleteId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => bannerService.toggleBannerActive(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: BannerCreateNewValues) =>
      bannerService.createBanner(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
      setCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: BannerUpdateValues;
    }) => bannerService.updateBanner(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
      // also refresh detail if user reopens quickly
      await queryClient.invalidateQueries({ queryKey: ["banner"] });
      setEditOpen(false);
      setSelectedId(null);
    },
  });

  const data = listQuery.data;

  if (data === undefined) {
    return <div className="space-y-6">rỗng</div>;
  }
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
        page={data?.page ?? page}
        size={data?.size ?? size}
        totalPages={data?.totalPages ?? 1}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        onSizeChange={setSize}
        onViewDetail={(id) => {
          setSelectedId(id);
          setViewOpen(true);
        }}
        onEdit={(id) => {
          setSelectedId(id);
          setEditOpen(true);
        }}
        onToggleActive={(id) => toggleMutation.mutate(id)}
        onDelete={(id) => {
          setDeleteId(id);
          setDeleteOpen(true);
        }}
      />

      <BannerCreateNew
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      <BannerViewDetail
        open={viewOpen}
        onOpenChange={(v) => {
          setViewOpen(v);
          if (!v) setSelectedId(null);
        }}
        banner={selectedBanner}
      />

      <BannerUpdate
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setSelectedId(null);
        }}
        submitting={updateMutation.isPending}
        banner={selectedBanner}
        onSubmit={(values) => {
          if (!selectedId) return;
          updateMutation.mutate({ id: selectedId, payload: values });
        }}
      />

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(v: boolean) => {
          setDeleteOpen(v);
          if (!v) setDeleteId(null);
        }}
        title="Xoá banner"
        description="Bạn có chắc muốn xoá banner này không? Hành động không thể hoàn tác."
        deleting={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
