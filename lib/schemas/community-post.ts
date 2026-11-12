import { z } from "zod";

export const MAX_COMMUNITY_POST_LENGTH = 2000;
export const MAX_COMMUNITY_POST_IMAGES = 10;

/**
 * The public composer. A post stands on its own: text, optional images, and optionally the rescue
 * case it is about.
 */
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
  media: z
    .array(z.object({ mediaId: z.string(), url: z.string() }))
    .max(
      MAX_COMMUNITY_POST_IMAGES,
      `Chỉ được đính kèm tối đa ${MAX_COMMUNITY_POST_IMAGES} ảnh`,
    ),
});

export type CommunityPostValues = z.infer<typeof communityPostSchema>;

export const communityPostDefaultValues: CommunityPostValues = {
  content: "",
  rescueCaseId: "",
  media: [],
};
