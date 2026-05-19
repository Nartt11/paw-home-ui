export type PostMediaType = "IMAGE" | "VIDEO" | "UNKNOWN";

export interface PostMedia {
  mediaId: string;
  uploaderId?: string;
  url: string;
  type: PostMediaType;
  createdAt?: string;
}

export interface Post {
  postId: string;
  authorId: string;
  authorUsername?: string;
  rescueCaseId?: string;
  content: string;
  tags: string[];
  media: PostMedia[];
  likeCount: number;
  commentCount: number;
  createdAt?: string;
  updatedAt?: string;
  raw: Record<string, unknown>;
}
