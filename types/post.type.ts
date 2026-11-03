export type PostMediaType = "IMAGE" | "VIDEO" | "UNKNOWN";

export interface PostMedia {
  mediaId: string;
  uploaderId?: string;
  url: string;
  type: PostMediaType;
  createdAt?: string;
}

export interface PostSummary {
  postId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Post extends PostSummary {
  rescueCaseId?: string;
  media: PostMedia[];
  updatedAt: string;
}

export interface PostFeedParams{
  pageSize: number;
  cursor?: string;
}

export interface PostCreatePayload {
  content: string;
  rescueCaseId?: string;
  mediaIds: string[];
  tagCodes: string[];
}

export interface PostUpdatePayload {
  content: string;
  mediaIds: string[];
  tagCodes: string[];
}
