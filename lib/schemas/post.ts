import { z } from "zod";

export const MAX_POST_MEDIA = 10;
export const MAX_POST_TAGS = 20;

export const postFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Nội dung bài đăng không được để trống")
    .max(2000, "Nội dung bài đăng không được vượt quá 2000 ký tự"),
  rescueCaseId: z.string(),
  media: z
    .array(z.object({ mediaId: z.string(), url: z.string() }))
    .max(MAX_POST_MEDIA, `Chỉ được đính kèm tối đa ${MAX_POST_MEDIA} ảnh`),
  tagCodes: z
    .array(z.string())
    .max(MAX_POST_TAGS, `Chỉ được chọn tối đa ${MAX_POST_TAGS} thẻ`),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const postFormDefaultValues: PostFormValues = {
  content: "",
  rescueCaseId: "",
  media: [],
  tagCodes: [],
};
