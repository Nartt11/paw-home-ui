import { z } from "zod";

export const MAX_COMMENT_LENGTH = 1000;

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Hãy viết bình luận trước khi gửi")
    .max(MAX_COMMENT_LENGTH, `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự`),
});

export type CommentValues = z.infer<typeof commentSchema>;
