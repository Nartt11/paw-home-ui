"use client";

import { EllipsisVerticalIcon, HeartIcon, LifeBuoyIcon, MessageCircleIcon, NewspaperIcon } from "lucide-react";

import { clickableRowProps } from "@/components/common/admin/clickable-row";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { POST_CATEGORY_LABEL } from "@/constants/post";
import { formatDateTime, formatRelativeTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types/post.type";

export interface PostModerationListProps {
  data: PostSummary[];
  loading?: boolean;
  /** The post open in the side panel, highlighted in the list. */
  selectedId?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  onOpen: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return (parts.at(-1)?.[0] ?? "?").toUpperCase();
}

function Thumbnails({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  const shown = urls.slice(0, 3);
  const more = urls.length - shown.length;

  return (
    <div className="flex shrink-0 gap-1.5">
      {shown.map((url, index) => (
        <div key={url} className="relative size-16 overflow-hidden rounded-md border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" loading="lazy" className="size-full object-cover" />
          {more > 0 && index === shown.length - 1 ? (
            <span className="absolute inset-0 grid place-items-center bg-black/50 text-sm font-medium text-white">
              +{more}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PostRow({
  post,
  selected,
  onOpen,
  onEdit,
  onDelete,
}: {
  post: PostSummary;
  selected: boolean;
  onOpen: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}) {
  const row = clickableRowProps(() => onOpen(post.postId));
  const category = post.facets?.category;
  const images = post.imageUrls ?? [];
  const content = post.content?.trim();

  return (
    <li
      {...row}
      aria-label={`Bài đăng của ${post.authorName || "thành viên"}`}
      aria-current={selected || undefined}
      className={cn(
        row.className,
        "group flex gap-4 border-b px-4 py-4 transition-colors last:border-0 hover:bg-muted/40",
        selected && "bg-primary/5 hover:bg-primary/5",
      )}
    >
      <Avatar className="mt-0.5 size-9 shrink-0">
        {post.authorAvatarUrl ? <AvatarImage src={post.authorAvatarUrl} alt="" /> : null}
        <AvatarFallback>{initials(post.authorName)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-medium text-foreground">{post.authorName || "Thành viên PawHome"}</span>
          <time
            className="text-muted-foreground"
            dateTime={post.createdAt}
            title={formatDateTime(post.createdAt)}
          >
            {formatRelativeTime(post.createdAt)}
          </time>
          {category ? (
            <Badge variant="outline" className="font-normal">
              {POST_CATEGORY_LABEL[category]}
            </Badge>
          ) : null}
          {post.facets?.needsRescue && !post.rescueCase ? (
            <Badge className="border-transparent bg-amber-100 font-normal text-amber-900">Cần cứu hộ</Badge>
          ) : null}
        </div>

        <p className={cn("line-clamp-3 whitespace-pre-line text-sm leading-relaxed", !content && "italic text-muted-foreground")}>
          {content || "Bài đăng không có nội dung chữ."}
        </p>

        {post.rescueCase ? (
          <div className="inline-flex max-w-full items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1 text-xs">
            <LifeBuoyIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="font-medium">Ca {post.rescueCase.caseCode}</span>
            {post.rescueCase.locationText ? (
              <span className="truncate text-muted-foreground">{post.rescueCase.locationText}</span>
            ) : null}
            <Badge
              className={cn(
                "border-transparent font-normal",
                post.rescueCase.open ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800",
              )}
            >
              {post.rescueCase.open ? "Đang cần giúp" : "Đã xử lý"}
            </Badge>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <HeartIcon className="size-3.5" aria-hidden />
            {post.likeCount} lượt thích
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircleIcon className="size-3.5" aria-hidden />
            {post.commentCount} bình luận
          </span>
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
          {post.tags.length > 4 ? <span>+{post.tags.length - 4}</span> : null}
        </div>
      </div>

      <div className="hidden sm:block">
        <Thumbnails urls={images} />
      </div>

      {onEdit || onDelete ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="Thao tác khác">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            {onEdit ? <DropdownMenuItem onClick={() => onEdit(post.postId)}>Chỉnh sửa</DropdownMenuItem> : null}
            {onEdit && onDelete ? <DropdownMenuSeparator /> : null}
            {onDelete ? (
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(post.postId)}>
                Xóa bài đăng
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </li>
  );
}

export function PostModerationList({
  data,
  loading,
  selectedId,
  emptyTitle = "Không có bài đăng nào",
  emptyDescription = "Thử đổi bộ lọc hoặc từ khóa tìm kiếm.",
  onOpen,
  onEdit,
  onDelete,
}: PostModerationListProps) {
  if (loading && data.length === 0) {
    return (
      <ul className="rounded-lg border" aria-busy>
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i} className="flex gap-4 border-b px-4 py-4 last:border-0">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="hidden size-16 sm:block" />
          </li>
        ))}
      </ul>
    );
  }

  if (data.length === 0) {
    return (
      <div className="grid place-items-center gap-2 rounded-lg border border-dashed px-4 py-16 text-center">
        <NewspaperIcon className="size-8 text-muted-foreground" aria-hidden />
        <p className="font-medium">{emptyTitle}</p>
        <p className="text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <ul className={cn("rounded-lg border transition-opacity", loading && "opacity-60")}>
      {data.map((post) => (
        <PostRow
          key={post.postId}
          post={post}
          selected={post.postId === selectedId}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
