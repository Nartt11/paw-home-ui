"use client";

import { EllipsisVerticalIcon, HeartIcon, LifeBuoyIcon, MessageCircleIcon, PencilIcon } from "lucide-react";

import { CommentSection } from "@/components/community/CommentSection";
import { PostAnalysisPanel } from "@/components/post/PostAnalysisPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { POST_CATEGORY_LABEL } from "@/constants/post";
import { formatDateTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post.type";

export interface PostDetailSheetProps {
  open: boolean;
  post?: Post | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export function PostDetailSheet({ open, post, loading, onOpenChange, onEdit, onDelete }: PostDetailSheetProps) {
  const media = post?.media ?? [];
  const category = post?.facets?.category;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b p-4 pr-12">
          {post ? (
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                {post.authorAvatarUrl ? <AvatarImage src={post.authorAvatarUrl} alt="" /> : null}
                <AvatarFallback>{(post.authorName?.trim().split(/\s+/).at(-1)?.[0] ?? "?").toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate">{post.authorName || "Thành viên PawHome"}</SheetTitle>
                <SheetDescription>
                  Đăng lúc {formatDateTime(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt
                    ? ` · sửa lúc ${formatDateTime(post.updatedAt)}`
                    : ""}
                </SheetDescription>
              </div>
            </div>
          ) : (
            <>
              <SheetTitle>Chi tiết bài đăng</SheetTitle>
              <SheetDescription>Đang tải bài đăng...</SheetDescription>
            </>
          )}

          {post && (onEdit || onDelete) ? (
            <div className="mt-3 flex items-center gap-2">
              {onEdit ? (
                <Button size="sm" variant="outline" onClick={() => onEdit(post.postId)}>
                  <PencilIcon className="size-4" />
                  Chỉnh sửa
                </Button>
              ) : null}
              {onDelete ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="size-8" aria-label="Thao tác khác">
                      <EllipsisVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(post.postId)}>
                      Xóa bài đăng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          ) : null}
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {loading && !post ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !post ? (
            <p className="text-sm text-muted-foreground">Không tải được bài đăng.</p>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {category ? <Badge variant="outline">{POST_CATEGORY_LABEL[category]}</Badge> : null}
                  {post.facets?.species ? <Badge variant="outline">{post.facets.species}</Badge> : null}
                  {post.facets?.province ? <Badge variant="outline">{post.facets.province}</Badge> : null}
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <p className={cn("whitespace-pre-wrap text-sm leading-relaxed", !post.content?.trim() && "italic text-muted-foreground")}>
                  {post.content?.trim() || "Bài đăng không có nội dung chữ."}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <HeartIcon className="size-3.5" aria-hidden />
                    {post.likeCount} lượt thích
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircleIcon className="size-3.5" aria-hidden />
                    {post.commentCount} bình luận
                  </span>
                </div>
              </div>

              {media.length > 0 ? (
                <div className={cn("grid gap-2", media.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                  {media.map((item, index) => (
                    <a
                      key={item.mediaId}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={`Ảnh ${index + 1} của bài đăng`} className="size-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : null}

              {post.rescueCase ? (
                <Section title="Ca cứu hộ được nhắc tới">
                  <div className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                    <LifeBuoyIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">Ca {post.rescueCase.caseCode}</div>
                      {post.rescueCase.locationText ? (
                        <div className="truncate text-muted-foreground">{post.rescueCase.locationText}</div>
                      ) : null}
                    </div>
                    <Badge
                      className={cn(
                        "border-transparent font-normal",
                        post.rescueCase.open ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800",
                      )}
                    >
                      {post.rescueCase.open ? "Đang cần giúp" : "Đã xử lý"}
                    </Badge>
                  </div>
                </Section>
              ) : null}

              <Separator />

              <Section title="Phân tích AI">
                <PostAnalysisPanel postId={post.postId} />
              </Section>

              <Separator />

              <Section title={`Bình luận (${post.commentCount})`}>
                <CommentSection postId={post.postId} canModerate />
              </Section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
