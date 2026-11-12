export interface PostComment {
  commentId: string;
  postId: string;
  parentCommentId?: string | null;
  authorId: string;
  authorUsername: string;
  content: string;
  likeCount: number;
  replyCount: number;
  createdAt: string;
}

export interface CommentCreatePayload {
  content: string;
  parentCommentId?: string;
}

export interface CommentPage {
  items: PostComment[];
  /** Send back as `cursor` to load older comments. */
  nextCursor?: string | null;
  hasMore: boolean;
}

export interface LikeStatus {
  targetId: string;
  liked: boolean;
}
