import { z } from "zod";

export const profileSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(50, "Username không được vượt quá 50 ký tự"),
  avatarUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^https?:\/\/\S+$/i.test(value),
      "Avatar URL phải là liên kết hợp lệ",
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileDefaultValues: ProfileFormValues = {
  userName: "",
  avatarUrl: "",
};
