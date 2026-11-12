import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";

import { postKeys } from "@/hooks/use-post";
import commentService from "@/services/comment/comment";
import likeService from "@/services/like/like";
import type { CursorPage } from "@/services/post/post";
import type { CommentCreatePayload } from "@/types/comment.type";
import type { Post, PostSummary } from "@/types/post.type";

const COMMENT_PAGE_SIZE = 10;

export const commentKeys = {
  all: ["post-comments"] as const,
  byPost: (postId: string) => [...commentKeys.all, postId] as const,
};

type FeedData = InfiniteData<CursorPage<PostSummary>>;

/** Applies one change to a post wherever it is cached: every feed variant and its detail. */
function patchPostEverywhere(
  queryClient: QueryClient,
  postId: string,
  change: (post: PostSummary) => PostSummary,
) {
  queryClient.setQueriesData<FeedData>({ queryKey: postKeys.feeds() }, (data) =>
    data
      ? {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.postId === postId ? change(post) : post,
            ),
          })),
        }
      : data,
  );
  queryClient.setQueryData<Post>(postKeys.detail(postId), (post) =>
    post ? (change(post) as Post) : post,
  );
}

/** Like or unlike. The heart flips at once and is put back if the server refuses. */
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, like }: { postId: string; like: boolean }) =>
      like ? likeService.likePost(postId) : likeService.unlikePost(postId),

    onMutate: ({ postId, like }) => {
      patchPostEverywhere(queryClient, postId, (post) =>
        post.likedByMe === like
          ? post
          : {
              ...post,
              likedByMe: like,
              likeCount: Math.max(0, post.likeCount + (like ? 1 : -1)),
            },
      );
    },

    onError: (_error, { postId, like }) => {
      patchPostEverywhere(queryClient, postId, (post) =>
        post.likedByMe === !like
          ? post
          : {
              ...post,
              likedByMe: !like,
              likeCount: Math.max(0, post.likeCount + (like ? -1 : 1)),
            },
      );
    },
  });
}

/** Top-level comments of a post, newest first. */
export function usePostComments(postId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: ({ pageParam }) =>
      commentService.getCommentsByPost(postId, {
        pageSize: COMMENT_PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
    enabled,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CommentCreatePayload) =>
      commentService.createComment(postId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) });
      // the server counts comments asynchronously; show the new total without waiting for it
      patchPostEverywhere(queryClient, postId, (post) => ({
        ...post,
        commentCount: post.commentCount + 1,
      }));
    },
  });
}
