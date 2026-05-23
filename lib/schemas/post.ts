import { z } from "zod";

export const postFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Nội dung bài đăng không được để trống")
    .max(5000, "Nội dung bài đăng không được vượt quá 5000 ký tự"),
  rescueCaseId: z
    .string()
    .trim()
    .max(100, "Rescue case ID không được vượt quá 100 ký tự")
    .optional()
    .or(z.literal("")),
  mediaIdsText: z.string().trim().optional().or(z.literal("")),
  tagCodesText: z.string().trim().optional().or(z.literal("")),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const postFormDefaultValues: PostFormValues = {
  content: "",
  rescueCaseId: "",
  mediaIdsText: "",
  tagCodesText: "",
};
