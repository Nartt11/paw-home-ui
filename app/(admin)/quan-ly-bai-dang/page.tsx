"use client";

import * as React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { DeleteModal } from "@/components/common/admin/DeleteModal";
import {
  PostFormDialog,
  type PostFormValues,
} from "@/components/post/PostFormDialog";
import { PostListTable } from "@/components/post/PostListTable";
import { PostViewDetail } from "@/components/post/PostViewDetail";
import { useListUrlState } from "@/hooks/use-list-url-state";
import postService from "@/services/post/post";
import type {
  CreatePostPayload,
  UpdatePostPayload,
} from "@/services/post/post";

function parseCommaSeparatedValues(value: string | undefined) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCreatePostPayload(values: PostFormValues): CreatePostPayload {
  const rescueCaseId = values.rescueCaseId?.trim();

  return {
    content: values.content.trim(),
    rescueCaseId: rescueCaseId || undefined,
    mediaIds: parseCommaSeparatedValues(values.mediaIdsText),
    tagCodes: parseCommaSeparatedValues(values.tagCodesText),
  };
}

function buildUpdatePostPayload(values: PostFormValues): UpdatePostPayload {
  return {
    content: values.content.trim(),
    mediaIds: parseCommaSeparatedValues(values.mediaIdsText),
    tagCodes: parseCommaSeparatedValues(values.tagCodesText),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function PostManagementPage() {
  const { page, size, setParams } = useListUrlState({
    defaultPage: 0,
    defaultSize: 10,
  });
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ["posts", { page, size }],
    queryFn: () => postService.getAllPosts({ page, size }),
  });

  const detailQuery = useQuery({
    queryKey: ["post", selectedId],
    queryFn: () => postService.getPostById(selectedId as string),
    enabled: Boolean(selectedId) && (viewOpen || editOpen),
  });

  const createMutation = useMutation({
    mutationFn: (values: PostFormValues) =>
      postService.createPost(buildCreatePostPayload(values)),
    onSuccess: async () => {
      toast.success("Đã tạo bài đăng thành công");
      setCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Không thể tạo bài đăng"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: PostFormValues) => {
      if (!selectedId) {
        throw new Error("Không tìm thấy bài đăng cần cập nhật");
      }

      return postService.updatePost(selectedId, buildUpdatePostPayload(values));
    },
    onSuccess: async () => {
      toast.success("Đã cập nhật bài đăng thành công");
      setEditOpen(false);
      setSelectedId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["post"] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Không thể cập nhật bài đăng"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: async () => {
      toast.success("Đã xóa bài đăng thành công");
      setDeleteOpen(false);
      setDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Không thể xóa bài đăng"));
    },
  });

  const data = listQuery.data;
  const selectedPost = detailQuery.data;
  const apiPage = data?.page ?? page;
  const uiPage = apiPage + 1;

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý bài đăng"
        description="Danh sách bài đăng được đồng bộ từ các API post"
        buttonText="Thêm bài đăng"
        handleOpenModal={() => setCreateOpen(true)}
      />

      <PostListTable
        data={data?.content ?? []}
        loading={listQuery.isPending}
        page={uiPage}
        size={data?.size ?? size}
        totalPages={data?.totalPages ?? 1}
        totalElements={data?.totalElements ?? 0}
        onPageChange={(nextPage) => setParams({ page: nextPage - 1 })}
        onSizeChange={(nextSize) => setParams({ page: 0, size: nextSize })}
        onViewDetail={(id) => {
          setSelectedId(id);
          setViewOpen(true);
        }}
        onEdit={(id) => {
          setSelectedId(id);
          setEditOpen(true);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setDeleteOpen(true);
        }}
      />

      <PostFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      <PostViewDetail
        open={viewOpen}
        post={selectedPost}
        loading={detailQuery.isFetching}
        onOpenChange={(nextOpen) => {
          setViewOpen(nextOpen);
          if (!nextOpen) setSelectedId(null);
        }}
      />

      <PostFormDialog
        mode="update"
        open={editOpen}
        post={selectedPost}
        loading={detailQuery.isFetching}
        submitting={updateMutation.isPending}
        onOpenChange={(nextOpen) => {
          setEditOpen(nextOpen);
          if (!nextOpen) setSelectedId(null);
        }}
        onSubmit={(values) => updateMutation.mutate(values)}
      />

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(nextOpen) => {
          setDeleteOpen(nextOpen);
          if (!nextOpen) setDeleteId(null);
        }}
        title="Xóa bài đăng"
        description="Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác."
        confirming={deleteMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={() => {
          if (!deleteId) return;
          deleteMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
