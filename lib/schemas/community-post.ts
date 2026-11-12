import { z } from "zod";

export const MAX_COMMUNITY_POST_LENGTH = 2000;

/** The public composer: what a member writes, and optionally the rescue case it is about. */
export const communityPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Hãy viết vài dòng trước khi đăng")
    .max(
      MAX_COMMUNITY_POST_LENGTH,
      `Nội dung không được vượt quá ${MAX_COMMUNITY_POST_LENGTH} ký tự`,
    ),
  rescueCaseId: z.string(),
});

export type CommunityPostValues = z.infer<typeof communityPostSchema>;

export const communityPostDefaultValues: CommunityPostValues = {
  content: "",
  rescueCaseId: "",
};
