import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .min(1, "Username hoặc email không được để trống"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được quá 100 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
