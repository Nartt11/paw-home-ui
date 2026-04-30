"use client";

import * as React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { BannerListTable } from "@/components/banner/BannerListTable";
import DeleteModal from "@/components/common/DeleteModal";
import { BannerCreateNew } from "@/components/banner/BannerCreateNew";
import type { BannerCreateNewValues } from "@/components/banner/BannerCreateNew";
import { BannerViewDetail } from "@/components/banner/BannerViewDetail";
import { BannerUpdate } from "@/components/banner/BannerUpdate";
import type { BannerUpdateValues } from "@/components/banner/BannerUpdate";

import bannerService from "@/services/banner/banner";
import type { Banner } from "@/types/banner.type";

function toNumber(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function setQueryParams(
  router: ReturnType<typeof useRouter>,
  queryParams: ReturnType<typeof useSearchParams>,
  patch: Record<string, string | number | undefined | null>,
) {
  const next = new URLSearchParams(queryParams.toString());
  Object.entries(patch).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") next.delete(k);
    else next.set(k, String(v));
  });
  router.replace(`?${next.toString()}`);
}

export default function BannerManagementPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = toNumber(queryParams.get("page"), 1);
  const size = toNumber(queryParams.get("size"), 10);

  const listQuery = useQuery({
    queryKey: ["banners", page, size],
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

  const selectedBanner: Banner | null = detailQuery.data ?? null;

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
        onPageChange={(nextPage) =>
          setQueryParams(router, queryParams, { page: nextPage })
        }
        onSizeChange={(nextSize) =>
          setQueryParams(router, queryParams, { page: 1, size: nextSize })
        }
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
