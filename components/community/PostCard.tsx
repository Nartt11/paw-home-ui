"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

import { RescueCaseCard } from "@/components/community/RescueCaseCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  formatRelativeTime,
  type RescueCaseBrief,
} from "@/lib/rescue-case-display";
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
  onShareCase?: (rescueCase: RescueCaseBrief) => void;
}

export function PostCard({ post, onShareCase }: PostCardProps) {
  const images = (post.imageUrls ?? []).slice(0, MAX_IMAGES);
  const hiddenImages = (post.imageUrls?.length ?? 0) - images.length;
  const initial = post.authorUsername?.charAt(0).toUpperCase() || "?";

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
          className={
            images.length === 1 ? "mt-3 grid gap-2" : "mt-3 grid grid-cols-2 gap-2"
          }
        >
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-video overflow-hidden rounded-xl bg-muted"
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                  +{hiddenImages}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {post.rescueCase ? (
        <RescueCaseCard
          className="mt-3"
          rescueCase={post.rescueCase}
          onShare={onShareCase}
        />
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

      <footer className="mt-4 flex items-center gap-5 border-t pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Heart
            className={
              post.likedByMe ? "size-4 fill-red-500 text-red-500" : "size-4"
            }
          />
          {post.likeCount} lượt thích
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="size-4" />
          {post.commentCount} bình luận
        </span>
      </footer>
    </article>
  );
}
