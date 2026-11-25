"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { DeleteModal } from "@/components/common/admin/DeleteModal";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import { PostDetailSheet } from "@/components/post/PostDetailSheet";
import { PostFormDialog, type PostFormValues } from "@/components/post/PostFormDialog";
import { PostModerationList } from "@/components/post/PostModerationList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POST_CATEGORIES, POST_CATEGORY_LABEL, POST_SORTS, type PostSortKey } from "@/constants/post";
import { getOptionalSearchParam, useListUrlState } from "@/hooks/use-list-url-state";
import { useCreatePost, useDeletePost, usePostDetail, usePosts, useUpdatePost } from "@/hooks/use-post";
import { cn } from "@/lib/utils";
import type { PostCategory, PostCreatePayload, PostUpdatePayload } from "@/types/post.type";

function buildCreatePostPayload(values: PostFormValues): PostCreatePayload {
  return {
    content: values.content,
    rescueCaseId: values.rescueCaseId || undefined,
    mediaIds: values.media.map((item) => item.mediaId),
    tagCodes: values.tagCodes,
  };
}

function buildUpdatePostPayload(values: PostFormValues): PostUpdatePayload {
  return {
    content: values.content,
    mediaIds: values.media.map((item) => item.mediaId),
    tagCodes: values.tagCodes,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isCategory(value?: string): value is PostCategory {
  return !!value && (POST_CATEGORIES as string[]).includes(value);
}

function isSort(value?: string): value is PostSortKey {
  return !!value && value in POST_SORTS;
}

/** A filter that is on or off, shown as a pressed / unpressed chip. */
function FilterChip({ pressed, onPressedChange, children }: {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn("rounded-full", pressed && "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary")}
    >
      {children}
    </Button>
  );
}

export default function PostManagementPage() {
  const { searchParams, page, size, setParams, setPage, setSize } = useListUrlState({ defaultPage: 0, defaultSize: 10 });

  const q = getOptionalSearchParam(searchParams.get("q"));
  const categoryParam = getOptionalSearchParam(searchParams.get("category"));
  const category = isCategory(categoryParam) ? categoryParam : undefined;
  const needsRescue = searchParams.get("needsRescue") === "true";
  const hasOpenCase = searchParams.get("openCase") === "true";
  const sortParam = getOptionalSearchParam(searchParams.get("sort"));
  const sort: PostSortKey = isSort(sortParam) ? sortParam : "newest";
  const filtered = !!(q || category || needsRescue || hasOpenCase);

  // The box updates at once; the list follows after a short pause in typing.
  const [searchText, setSearchText] = React.useState(q ?? "");
  React.useEffect(() => {
    if ((q ?? "") === searchText.trim()) return;
    const timer = window.setTimeout(() => setParams({ q: searchText.trim(), page: 0 }), 350);
    return () => window.clearTimeout(timer);
  }, [searchText, q, setParams]);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const listQuery = usePosts({
    page,
    pageSize: size,
    search: q,
    category,
    needsRescue: needsRescue || undefined,
    hasOpenCase: hasOpenCase || undefined,
    sortBy: POST_SORTS[sort].sortBy,
    sortOrder: "desc",
  });
  const detailQuery = usePostDetail(selectedId ?? undefined);
  const editQuery = usePostDetail(editId ?? undefined);
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const data = listQuery.data;

  const handleCreatePost = async (values: PostFormValues) => {
    try {
      await createPostMutation.mutateAsync(buildCreatePostPayload(values));
      toast.success("Đã tạo bài đăng");
      setCreateOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tạo bài đăng"));
    }
  };

  const handleUpdatePost = async (values: PostFormValues) => {
    if (!editId) return;
    try {
      await updatePostMutation.mutateAsync({ id: editId, payload: buildUpdatePostPayload(values) });
      toast.success("Đã cập nhật bài đăng");
      setEditId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể cập nhật bài đăng"));
    }
  };

  const handleDeletePost = async () => {
    if (!deleteId) return;
    try {
      await deletePostMutation.mutateAsync(deleteId);
      toast.success("Đã xóa bài đăng");
      if (selectedId === deleteId) setSelectedId(null);
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể xóa bài đăng"));
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setParams({ q: undefined, category: undefined, needsRescue: undefined, openCase: undefined, page: 0 });
  };

  return (
    <div className="space-y-4">
      <TitlePerPage
        title="Quản lý bài đăng"
        description="Bảng tin cộng đồng: đọc bài, xem phân tích AI và bình luận, sửa hoặc gỡ bài không phù hợp."
        buttonText="Thêm bài đăng"
        handleOpenModal={() => setCreateOpen(true)}
      />

      <div className="space-y-3">
        <Tabs
          value={category ?? "ALL"}
          onValueChange={(value) => setParams({ category: value === "ALL" ? undefined : value, page: 0 })}
        >
          <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 sm:mx-0 sm:px-0">
            <TabsList>
              <TabsTrigger value="ALL">Tất cả</TabsTrigger>
              {POST_CATEGORIES.map((value) => (
                <TabsTrigger key={value} value={value}>
                  {POST_CATEGORY_LABEL[value]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1 lg:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Tìm theo nội dung hoặc tên tác giả..."
              aria-label="Tìm bài đăng"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterChip
              pressed={needsRescue}
              onPressedChange={(on) => setParams({ needsRescue: on || undefined, page: 0 })}
            >
              Cần cứu hộ
            </FilterChip>
            <FilterChip
              pressed={hasOpenCase}
              onPressedChange={(on) => setParams({ openCase: on || undefined, page: 0 })}
            >
              Ca đang mở
            </FilterChip>

            <Select value={sort} onValueChange={(value) => setParams({ sort: value === "newest" ? undefined : value, page: 0 })}>
              <SelectTrigger size="sm" className="w-44" aria-label="Sắp xếp">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(POST_SORTS) as PostSortKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {POST_SORTS[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex min-h-8 items-center justify-between gap-2 text-sm text-muted-foreground">
          <span aria-live="polite">
            {data ? `${data.totalElements.toLocaleString("vi-VN")} bài đăng` : " "}
          </span>
          {filtered ? (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon className="size-4" />
              Bỏ lọc
            </Button>
          ) : null}
        </div>
      </div>

      <PostModerationList
        data={data?.content ?? []}
        loading={listQuery.isFetching}
        selectedId={selectedId}
        emptyTitle={filtered ? "Không có bài đăng khớp bộ lọc" : "Chưa có bài đăng"}
        emptyDescription={filtered ? "Thử đổi bộ lọc hoặc từ khóa tìm kiếm." : "Bài đăng của cộng đồng sẽ xuất hiện tại đây."}
        onOpen={setSelectedId}
        onEdit={setEditId}
        onDelete={setDeleteId}
      />

      <PageControls
        page={data?.page ?? page}
        pageSize={data?.size ?? size}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      <PostDetailSheet
        open={!!selectedId}
        post={detailQuery.data ?? null}
        loading={detailQuery.isPending}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onEdit={setEditId}
        onDelete={setDeleteId}
      />

      <PostFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createPostMutation.isPending}
        onSubmit={handleCreatePost}
      />

      <PostFormDialog
        mode="update"
        open={!!editId}
        post={editQuery.data ?? null}
        loading={editQuery.isFetching}
        submitting={updatePostMutation.isPending}
        onOpenChange={(open) => !open && setEditId(null)}
        onSubmit={handleUpdatePost}
      />

      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa bài đăng"
        description="Bài đăng sẽ bị gỡ khỏi bảng tin cộng đồng; người dùng không còn xem được bài và bình luận của nó."
        confirming={deletePostMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={handleDeletePost}
      />
    </div>
  );
}
