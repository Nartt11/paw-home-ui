"use client";

import * as React from "react";

import { toast } from "sonner";

import { DeleteModal } from "@/components/common/admin/DeleteModal";
import { PageControls } from "@/components/common/PageControl";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import {
  PostFormDialog,
  type PostFormValues,
} from "@/components/post/PostFormDialog";
import { PostListTable } from "@/components/post/PostListTable";
import { PostViewDetail } from "@/components/post/PostViewDetail";
import { useListUrlState } from "@/hooks/use-list-url-state";
import {
  useCreatePost,
  useDeletePost,
  usePostDetail,
  usePosts,
  useUpdatePost,
} from "@/hooks/use-post";
import type { PostCreatePayload, PostUpdatePayload } from "@/types/post.type";

function parseCommaSeparatedValues(value: string | undefined) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCreatePostPayload(
  values: PostFormValues,
): PostCreatePayload {
  const rescueCaseId = values.rescueCaseId?.trim();

  return {
    content: values.content.trim(),
    rescueCaseId: rescueCaseId || undefined,
    mediaIds: parseCommaSeparatedValues(values.mediaIdsText),
    tagCodes: parseCommaSeparatedValues(values.tagCodesText),
  };
}

function buildUpdatePostPayload(
  values: PostFormValues,
): PostUpdatePayload {
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
  const { page, size, setPage, setSize } = useListUrlState({
    defaultPage: 0,
    defaultSize: 10,
  });

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const listQuery = usePosts({ page, pageSize: size });
  const detailQuery = usePostDetail(
    selectedId && (viewOpen || editOpen) ? selectedId : undefined,
  );
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const data = listQuery.data;
  const selectedPost = detailQuery.data ?? null;

  const handleCreatePost = React.useCallback(
    async (values: PostFormValues) => {
      try {
        await createPostMutation.mutateAsync(buildCreatePostPayload(values));
        toast.success("Đã tạo bài đăng thành công");
        setCreateOpen(false);
      } catch (error) {
        toast.error(getErrorMessage(error, "Không thể tạo bài đăng"));
      }
    },
    [createPostMutation],
  );

  const handleUpdatePost = React.useCallback(
    async (values: PostFormValues) => {
      if (!selectedId) {
        toast.error("Không tìm thấy bài đăng cần cập nhật");
        return;
      }

      try {
        await updatePostMutation.mutateAsync({
          id: selectedId,
          payload: buildUpdatePostPayload(values),
        });
        toast.success("Đã cập nhật bài đăng thành công");
        setEditOpen(false);
        setSelectedId(null);
      } catch (error) {
        toast.error(getErrorMessage(error, "Không thể cập nhật bài đăng"));
      }
    },
    [selectedId, updatePostMutation],
  );

  const handleDeletePost = React.useCallback(async () => {
    if (!deleteId) return;

    try {
      await deletePostMutation.mutateAsync(deleteId);
      toast.success("Đã xóa bài đăng thành công");
      setDeleteOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể xóa bài đăng"));
    }
  }, [deleteId, deletePostMutation]);

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

      <PageControls
        page={data?.page ?? page}
        pageSize={data?.size ?? size}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      <PostFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createPostMutation.isPending}
        onSubmit={handleCreatePost}
      />

      <PostViewDetail
        open={viewOpen}
        post={selectedPost}
        loading={detailQuery.isPending}
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
        submitting={updatePostMutation.isPending}
        onOpenChange={(nextOpen) => {
          setEditOpen(nextOpen);
          if (!nextOpen) setSelectedId(null);
        }}
        onSubmit={handleUpdatePost}
      />

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(nextOpen) => {
          setDeleteOpen(nextOpen);
          if (!nextOpen) setDeleteId(null);
        }}
        title="Xóa bài đăng"
        description="Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác."
        confirming={deletePostMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={handleDeletePost}
      />
    </div>
  );
}
