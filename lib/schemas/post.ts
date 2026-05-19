import { z } from "zod";

export const postFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Noi dung bai dang khong duoc de trong")
    .max(5000, "Noi dung bai dang khong duoc vuot qua 5000 ky tu"),
  rescueCaseId: z
    .string()
    .trim()
    .max(100, "Rescue case ID khong duoc vuot qua 100 ky tu")
    .optional()
    .or(z.literal("")),
  mediaIdsText: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  tagCodesText: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const postFormDefaultValues: PostFormValues = {
  content: "",
  rescueCaseId: "",
  mediaIdsText: "",
  tagCodesText: "",
};
