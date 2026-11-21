import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .min(1, "Nhập email hoặc tên đăng nhập"),
  // Length rules belong to sign-up; here we only need something to send.
  password: z
    .string()
    .min(1, "Nhập mật khẩu")
    .max(100, "Mật khẩu không được quá 100 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email("Email không hợp lệ").trim(),
    username: z
      .string()
      .trim()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(50, "Tên đăng nhập không được quá 50 ký tự"),
    full_name: z
      .string()
      .trim()
      .min(1, "Hãy nhập tên hiển thị")
      .max(100, "Tên hiển thị không được quá 100 ký tự"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(100, "Mật khẩu không được quá 100 ký tự"),
    confirmPassword: z.string().min(8, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Email không hợp lệ").trim(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(100, "Mật khẩu không được quá 100 ký tự"),
    confirmPassword: z.string().min(8, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const resendVerificationSchema = z.object({
  email: z.email("Email không hợp lệ").trim(),
});

export type ResendVerificationSchema = z.infer<typeof resendVerificationSchema>;
