"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateComment, usePostComments } from "@/hooks/use-post-interactions";
import { useRequireLogin } from "@/hooks/use-require-login";
import { formatRelativeTime } from "@/lib/rescue-case-display";
import { commentSchema, type CommentValues } from "@/lib/schemas/comment";

export interface CommentSectionProps {
  postId: string;
}

/** Comments of one post: read by anyone, written by members. Loaded only when opened. */
export function CommentSection({ postId }: CommentSectionProps) {
  const { signedIn, requireLogin } = useRequireLogin();
  const commentsQuery = usePostComments(postId);
  const createCommentMutation = useCreateComment(postId);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const comments = commentsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const submit = handleSubmit(async (values) => {
    if (!requireLogin("Hãy đăng nhập để bình luận.")) return;
    try {
      await createCommentMutation.mutateAsync({ content: values.content });
      reset({ content: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không gửi được bình luận",
      );
    }
  });

  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      <form onSubmit={submit} className="space-y-1">
        <div className="flex gap-2">
          <Input
            aria-label="Viết bình luận"
            placeholder={
              signedIn ? "Viết bình luận..." : "Đăng nhập để bình luận"
            }
            disabled={createCommentMutation.isPending}
            aria-invalid={Boolean(errors.content)}
            {...register("content")}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Gửi bình luận"
            disabled={createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
        <FieldError errors={[errors.content]} />
      </form>

      {commentsQuery.isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-2/3 rounded-lg" />
        </div>
      ) : commentsQuery.isError ? (
        <p className="text-sm text-muted-foreground">
          Không tải được bình luận.
        </p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Chưa có bình luận nào. Hãy là người đầu tiên.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.commentId} className="flex gap-2">
              <Avatar className="size-7">
                <AvatarFallback className="text-xs">
                  {comment.authorUsername?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 rounded-xl bg-muted/60 px-3 py-2">
                <p className="text-xs">
                  <span className="font-semibold text-foreground">
                    {comment.authorUsername}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </p>
                <p className="mt-0.5 whitespace-pre-line break-words text-sm text-foreground">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {commentsQuery.hasNextPage ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => commentsQuery.fetchNextPage()}
          disabled={commentsQuery.isFetchingNextPage}
        >
          {commentsQuery.isFetchingNextPage
            ? "Đang tải..."
            : "Xem bình luận cũ hơn"}
        </Button>
      ) : null}
    </div>
  );
}
