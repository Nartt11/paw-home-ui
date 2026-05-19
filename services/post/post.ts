import http from "@/lib/http";
import { mapPage } from "@/mappers/common";
import { mapPost } from "@/mappers/post";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";
import type { Post } from "@/types/post.type";
import type {
  CreatePostPayloadDto,
  PostDto,
  PostSummaryDto,
  UpdatePostPayloadDto,
} from "./post-dto";

import type { CursorPageDto, ListParams, PageDto } from "../api-dto";

export interface PostFeedParams extends ListParams {
  cursor?: string;
}

export type CreatePostPayload = CreatePostPayloadDto;
export type UpdatePostPayload = UpdatePostPayloadDto;

const postService = {
  async getAllPosts(params: ListParams): Promise<PaginatedResponse<Post>> {
    const dto = await http.get<PageDto<PostSummaryDto>>(apiEndpoints.posts.root, {
      params,
    });

    return mapPage(dto, mapPost) as PaginatedResponse<Post>;
  },

  async getPostFeed(
    params: PostFeedParams,
  ): Promise<CursorPageDto<Post>> {
    const dto = await http.get<CursorPageDto<PostSummaryDto>>(apiEndpoints.posts.feed, {
      params,
    });

    return {
      items: dto.items.map(mapPost),
      nextCursor: dto.nextCursor,
      hasMore: dto.hasMore,
    };
  },

  async getPostById(id: string): Promise<Post> {
    const dto = await http.get<PostDto>(apiEndpoints.posts.byId(id));
    return mapPost(dto);
  },

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const dto = await http.post<PostDto, CreatePostPayload>(
      apiEndpoints.posts.root,
      payload,
    );
    return mapPost(dto);
  },

  async updatePost(id: string, payload: UpdatePostPayload): Promise<Post> {
    const dto = await http.put<PostDto, UpdatePostPayload>(
      apiEndpoints.posts.byId(id),
      payload,
    );
    return mapPost(dto);
  },

  async deletePost(id: string): Promise<void> {
    await http.delete(apiEndpoints.posts.byId(id));
  },
};

export default postService;
