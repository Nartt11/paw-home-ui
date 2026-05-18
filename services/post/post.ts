import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity, CursorPageDto, ListParams, PageDto } from "../api-dto";

export interface PostFeedParams extends ListParams {
  cursor?: string;
}

export type CreatePostPayload = ApiEntity;
export type UpdatePostPayload = ApiEntity;
export type PostSummaryDto = ApiEntity;
export type PostDto = ApiEntity;

const postService = {
  async getAllPosts(params: ListParams): Promise<PageDto<PostSummaryDto>> {
    return http.get<PageDto<PostSummaryDto>>(apiEndpoints.posts.root, {
      params,
    });
  },

  async getPostFeed(
    params: PostFeedParams,
  ): Promise<CursorPageDto<PostSummaryDto>> {
    return http.get<CursorPageDto<PostSummaryDto>>(apiEndpoints.posts.feed, {
      params,
    });
  },

  async getPostById(id: string): Promise<PostDto> {
    return http.get<PostDto>(apiEndpoints.posts.byId(id));
  },

  async createPost(payload: CreatePostPayload): Promise<PostDto> {
    return http.post<PostDto, CreatePostPayload>(apiEndpoints.posts.root, payload);
  },

  async updatePost(id: string, payload: UpdatePostPayload): Promise<PostDto> {
    return http.put<PostDto, UpdatePostPayload>(
      apiEndpoints.posts.byId(id),
      payload,
    );
  },

  async deletePost(id: string): Promise<void> {
    await http.delete(apiEndpoints.posts.byId(id));
  },
};

export default postService;
