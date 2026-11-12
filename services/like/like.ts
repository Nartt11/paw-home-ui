import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { LikeStatus } from "@/types/comment.type";

export type LikeStatusDto = LikeStatus;

const likeService = {
  async likePost(postId: string): Promise<LikeStatus> {
    return http.post<LikeStatus>(apiEndpoints.posts.like(postId), {});
  },

  async unlikePost(postId: string): Promise<LikeStatus> {
    return http.delete<LikeStatus>(apiEndpoints.posts.like(postId));
  },

  async likeComment(commentId: string): Promise<LikeStatus> {
    return http.post<LikeStatus>(apiEndpoints.comments.like(commentId), {});
  },

  async unlikeComment(commentId: string): Promise<LikeStatus> {
    return http.delete<LikeStatus>(apiEndpoints.comments.like(commentId));
  },
};

export default likeService;
