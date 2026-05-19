import { z } from "zod";

export const profileSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "Username phai co it nhat 3 ky tu")
    .max(50, "Username khong duoc vuot qua 50 ky tu"),
  avatarUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^https?:\/\/\S+$/i.test(value),
      "Avatar URL phai la lien ket hop le",
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileDefaultValues: ProfileFormValues = {
  userName: "",
  avatarUrl: "",
};
