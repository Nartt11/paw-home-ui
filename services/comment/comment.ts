import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity, CursorPageDto, ListParams } from "../api-dto";

export interface CommentListParams extends ListParams {
  cursor?: string;
}

export type CommentDto = ApiEntity;
export type CommentSummaryDto = ApiEntity;
export type CreateCommentPayload = ApiEntity;

const commentService = {
  async getCommentsByPost(
    postId: string,
    params: CommentListParams,
  ): Promise<CursorPageDto<CommentSummaryDto>> {
    return http.get<CursorPageDto<CommentSummaryDto>>(
      apiEndpoints.posts.comments(postId),
      { params },
    );
  },

  async createComment(
    postId: string,
    payload: CreateCommentPayload,
  ): Promise<CommentDto> {
    return http.post<CommentDto, CreateCommentPayload>(
      apiEndpoints.posts.comments(postId),
      payload,
    );
  },

  async getCommentById(id: string): Promise<CommentDto> {
    return http.get<CommentDto>(apiEndpoints.comments.byId(id));
  },

  async getReplies(
    id: string,
    params: CommentListParams,
  ): Promise<CursorPageDto<CommentSummaryDto>> {
    return http.get<CursorPageDto<CommentSummaryDto>>(
      apiEndpoints.comments.replies(id),
      { params },
    );
  },

  async deleteComment(id: string): Promise<void> {
    await http.delete(apiEndpoints.comments.byId(id));
  },
};

export default commentService;
