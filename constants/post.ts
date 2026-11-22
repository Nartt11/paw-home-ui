import type { PostCategory } from "@/types/post.type";

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  RESCUE: "Cứu hộ",
  ADOPTION: "Nhận nuôi",
  LOST: "Thất lạc",
  FOUND: "Tìm thấy",
  GENERAL: "Chung",
};

export const POST_CATEGORIES = Object.keys(POST_CATEGORY_LABEL) as PostCategory[];

/** Sort keys the backend accepts for GET /posts. */
export const POST_SORTS = {
  newest: { label: "Mới nhất", sortBy: "createdAt" },
  likes: { label: "Nhiều lượt thích", sortBy: "likeCount" },
  comments: { label: "Nhiều bình luận", sortBy: "commentCount" },
} as const;

export type PostSortKey = keyof typeof POST_SORTS;
