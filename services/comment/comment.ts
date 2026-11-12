import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type {
  CommentCreatePayload,
  CommentPage,
  PostComment,
} from "@/types/comment.type";

import type { ListParams } from "../api-dto";

export interface CommentListParams extends ListParams {
  /** `nextCursor` of the previous page. */
  cursor?: string;
}

export type CommentDto = PostComment;
export type CommentSummaryDto = PostComment;
export type CreateCommentPayload = CommentCreatePayload;

const commentService = {
  // GET /api/v1/posts/{postId}/comments - top-level comments, newest first (public)
  async getCommentsByPost(
    postId: string,
    params: CommentListParams,
  ): Promise<CommentPage> {
    return http.get<CommentPage>(apiEndpoints.posts.comments(postId), {
      params,
    });
  },

  // POST /api/v1/posts/{postId}/comments
  async createComment(
    postId: string,
    payload: CommentCreatePayload,
  ): Promise<PostComment> {
    return http.post<PostComment, CommentCreatePayload>(
      apiEndpoints.posts.comments(postId),
      payload,
    );
  },

  async getCommentById(id: string): Promise<PostComment> {
    return http.get<PostComment>(apiEndpoints.comments.byId(id));
  },

  async getReplies(id: string, params: CommentListParams): Promise<CommentPage> {
    return http.get<CommentPage>(apiEndpoints.comments.replies(id), { params });
  },

  async deleteComment(id: string): Promise<void> {
    await http.delete(apiEndpoints.comments.byId(id));
  },
};

export default commentService;
