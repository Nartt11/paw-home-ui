import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ListParams } from "@/types/api.type";
import type {
  PostCreatePayload,
  PostFeedParams,
  PostUpdatePayload,
} from "@/types/post.type";
import postService from "@/services/post";

export const postKeys = {
  all: ["posts"] as const,

  lists: () => [...postKeys.all, "list"] as const,
  list: (params: ListParams) => [...postKeys.lists(), params] as const,

  feeds: () => [...postKeys.all, "feed"] as const,
  feed: (params: PostFeedParams) => [...postKeys.feeds(), params] as const,

  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

export function usePosts(params: ListParams) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postService.getAllPosts(params),
  });
}

type FeedCursor = { cursor: string; cursorId?: string } | undefined;

export function usePostFeed(params: Omit<PostFeedParams, "cursor" | "cursorId">) {
  return useInfiniteQuery({
    queryKey: postKeys.feed(params as PostFeedParams),
    queryFn: ({ pageParam }) =>
      postService.getPostFeed({
        ...params,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    initialPageParam: undefined as FeedCursor,
    // the feed pages by (createdAt, postId): both values must go back, or posts sharing a timestamp are skipped
    getNextPageParam: (lastPage): FeedCursor =>
      lastPage.hasMore && lastPage.nextCursor
        ? { cursor: lastPage.nextCursor, cursorId: lastPage.nextCursorId }
        : undefined,
  });
}

export function usePostDetail(id?: string) {
  return useQuery({
    queryKey: postKeys.detail(id ?? ""),
    queryFn: () => postService.getPostById(id as string),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostCreatePayload) => postService.createPost(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: postKeys.feeds(),
      });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PostUpdatePayload }) =>
      postService.updatePost(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: postKeys.feeds(),
      });

      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.id),
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: postKeys.feeds(),
      });
    },
  });
}
