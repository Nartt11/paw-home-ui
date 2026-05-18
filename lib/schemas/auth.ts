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

export const registerSchema = z
  .object({
    email: z.email("Email khong hop le").trim(),
    username: z
      .string()
      .trim()
      .min(3, "Ten dang nhap phai co it nhat 3 ky tu")
      .max(50, "Ten dang nhap khong duoc qua 50 ky tu"),
    full_name: z
      .string()
      .trim()
      .max(100, "Ho ten khong duoc qua 100 ky tu")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Mat khau phai co it nhat 8 ky tu")
      .max(100, "Mat khau khong duoc qua 100 ky tu"),
    confirmPassword: z.string().min(8, "Vui long nhap lai mat khau"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mat khau xac nhan khong khop",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Email khong hop le").trim(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Mat khau phai co it nhat 8 ky tu")
      .max(100, "Mat khau khong duoc qua 100 ky tu"),
    confirmPassword: z.string().min(8, "Vui long nhap lai mat khau"),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mat khau xac nhan khong khop",
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const resendVerificationSchema = z.object({
  email: z.email("Email khong hop le").trim(),
});

export type ResendVerificationSchema = z.infer<
  typeof resendVerificationSchema
>;
