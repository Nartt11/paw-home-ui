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

export function usePostFeed(params: Omit<PostFeedParams, "cursor">) {
  return useInfiniteQuery({
    queryKey: postKeys.feed(params as PostFeedParams),
    queryFn: ({ pageParam }) =>
      postService.getPostFeed({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
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
