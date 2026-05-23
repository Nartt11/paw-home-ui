import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse, ListParams } from "@/types/api.type";
import type {
  Post,
  PostCreatePayload,
  PostFeedParams,
  PostSummary,
  PostUpdatePayload,
} from "@/types/post.type";

export interface CursorPage<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

const postService = {
  async getAllPosts(
    params: ListParams,
  ): Promise<PaginatedResponse<PostSummary>> {
    return await http.get<PaginatedResponse<PostSummary>>(
      apiEndpoints.posts.root,
      {
        params,
      },
    );
  },

  async getPostFeed(params: PostFeedParams): Promise<CursorPage<PostSummary>> {
    return await http.get<CursorPage<PostSummary>>(apiEndpoints.posts.feed, {
      params,
    });
  },

  async getPostById(id: string): Promise<Post> {
    return await http.get<Post>(apiEndpoints.posts.byId(id));
  },

  async createPost(payload: PostCreatePayload): Promise<Post> {
    return await http.post<Post, PostCreatePayload>(
      apiEndpoints.posts.root,
      payload,
    );
  },

  async updatePost(id: string, payload: PostUpdatePayload): Promise<Post> {
    return await http.put<Post, PostUpdatePayload>(
      apiEndpoints.posts.byId(id),
      payload,
    );
  },

  async deletePost(id: string): Promise<void> {
    await http.delete(apiEndpoints.posts.byId(id));
  },
};

export default postService;
