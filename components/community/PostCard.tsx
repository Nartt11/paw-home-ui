"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, LifeBuoy, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

import { CommentSection } from "@/components/community/CommentSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { useTogglePostLike } from "@/hooks/use-post-interactions";
import { useRequireLogin } from "@/hooks/use-require-login";
import {
  RESCUE_STATUS_LABEL,
  formatRelativeTime,
} from "@/lib/rescue-case-display";
import { cn } from "@/lib/utils";
import type { PostCategory, PostSummary } from "@/types/post.type";

const CATEGORY_LABEL: Record<PostCategory, string> = {
  RESCUE: "Cứu hộ",
  ADOPTION: "Nhận nuôi",
  LOST: "Thú lạc",
  FOUND: "Tìm thấy",
  GENERAL: "Chia sẻ",
};

const MAX_IMAGES = 4;

export interface PostCardProps {
  post: PostSummary;
  /** Opens the post's rescue case on its own. */
  onOpenCase?: (caseId: string) => void;
  /** Start with the comments open, e.g. on the page of a single post. */
  defaultCommentsOpen?: boolean;
}

/** Sends the link of a post through the device's share sheet, or copies it where there is none. */
async function sharePost(post: PostSummary) {
  const url = `${window.location.origin}${APP_ROUTES.communityPost(post.postId)}`;
  try {
    if (typeof navigator.share === "function") {
      await navigator.share({ title: "PawHome", text: post.content.slice(0, 120), url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Đã sao chép liên kết bài đăng");
  } catch (error) {
    // closing the share sheet is not a failure
    if (error instanceof DOMException && error.name === "AbortError") return;
    toast.error("Không chia sẻ được. Liên kết: " + url);
  }
}

/**
 * A post stands on its own: text, images, likes, comments and a shareable link. When it is about a
 * rescue case it only carries a small bar that opens the case separately.
 */
export function PostCard({
  post,
  onOpenCase,
  defaultCommentsOpen = false,
}: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = React.useState(defaultCommentsOpen);
  const { requireLogin } = useRequireLogin();
  const toggleLikeMutation = useTogglePostLike();

  const images = (post.imageUrls ?? []).slice(0, MAX_IMAGES);
  const hiddenImages = (post.imageUrls?.length ?? 0) - images.length;
  const initial = post.authorUsername?.charAt(0).toUpperCase() || "?";
  const liked = post.likedByMe === true;
  const rescueCase = post.rescueCase;

  const toggleLike = () => {
    if (!requireLogin("Hãy đăng nhập để thích bài đăng.")) return;
    toggleLikeMutation.mutate(
      { postId: post.postId, like: !liked },
      { onError: () => toast.error("Không cập nhật được lượt thích") },
    );
  };

  return (
    <article className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <header className="flex items-center gap-3">
        <Avatar>
          {post.authorAvatarUrl ? (
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorUsername} />
          ) : null}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {post.authorUsername}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>
        {post.facets ? (
          <Badge variant="outline">{CATEGORY_LABEL[post.facets.category]}</Badge>
        ) : null}
      </header>

      <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-foreground">
        {post.content}
      </p>

      {images.length > 0 ? (
        <div
          className={cn(
            "mt-3 grid gap-2",
            images.length > 1 && "grid-cols-2",
          )}
        >
          {images.map((url, index) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "relative block overflow-hidden rounded-xl bg-muted",
                images.length === 1 ? "aspect-video" : "aspect-square",
              )}
            >
              <Image
                src={url}
                alt={`Ảnh ${index + 1} của bài đăng`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
                unoptimized
              />
              {hiddenImages > 0 && index === images.length - 1 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                  +{hiddenImages}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      ) : null}

      {rescueCase ? (
        <button
          type="button"
          onClick={() => onOpenCase?.(rescueCase.caseId)}
          className={cn(
            "mt-3 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            rescueCase.open
              ? "border-orange-200 bg-orange-50/70 hover:bg-orange-100/70"
              : "border-border bg-muted/50 hover:bg-muted",
          )}
        >
          <LifeBuoy
            className={cn(
              "size-4 shrink-0",
              rescueCase.open ? "text-orange-600" : "text-muted-foreground",
            )}
          />
          <span className="min-w-0 flex-1 truncate">
            <span className="font-semibold text-foreground">
              Ca cứu hộ {rescueCase.caseCode}
            </span>
            <span className="text-muted-foreground">
              {" · "}
              {RESCUE_STATUS_LABEL[rescueCase.status]}
              {rescueCase.locationText ? ` · ${rescueCase.locationText}` : ""}
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-orange-700">
            Xem ca
          </span>
        </button>
      ) : null}

      <footer className="mt-3 flex items-center gap-1 border-t pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={liked}
          onClick={toggleLike}
          className={cn(liked && "text-red-600 hover:text-red-600")}
        >
          <Heart className={cn("size-4", liked && "fill-red-500 text-red-500")} />
          {post.likeCount} <span className="hidden sm:inline">Thích</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded={commentsOpen}
          onClick={() => setCommentsOpen((open) => !open)}
        >
          <MessageCircle className="size-4" />
          {post.commentCount} <span className="hidden sm:inline">Bình luận</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => sharePost(post)}
        >
          <Share2 className="size-4" />
          Chia sẻ
        </Button>
      </footer>

      {commentsOpen ? <CommentSection postId={post.postId} /> : null}
    </article>
  );
}
