import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity } from "../api-dto";

export type LikeStatusDto = ApiEntity;

const likeService = {
  async likePost(postId: string): Promise<LikeStatusDto> {
    return http.post<LikeStatusDto>(apiEndpoints.posts.like(postId), {});
  },

  async unlikePost(postId: string): Promise<LikeStatusDto> {
    return http.delete<LikeStatusDto>(apiEndpoints.posts.like(postId));
  },

  async likeComment(commentId: string): Promise<LikeStatusDto> {
    return http.post<LikeStatusDto>(apiEndpoints.comments.like(commentId), {});
  },

  async unlikeComment(commentId: string): Promise<LikeStatusDto> {
    return http.delete<LikeStatusDto>(apiEndpoints.comments.like(commentId));
  },
};

export default likeService;
