import { z } from "zod";

import { SYSTEM_ROLES } from "@/constants/roles";
import type { CreateAccountPayload } from "@/types/user.type";

const PHONE_SEPARATORS = /[\s().-]+/g;
const PHONE_FORMAT = /^\+?[0-9]{2,15}$/;

export function isValidPhone(value: string) {
  return !value || PHONE_FORMAT.test(value.replace(PHONE_SEPARATORS, ""));
}

export const CREATE_ACCOUNT_ROLES = [
  SYSTEM_ROLES.USER,
  SYSTEM_ROLES.ADMIN,
] as const;

export const createAccountSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được vượt quá 50 ký tự"),
  email: z.string().trim().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
  systemRole: z.enum(CREATE_ACCOUNT_ROLES),
  fullName: z.string().trim(),
  phone: z
    .string()
    .trim()
    .refine(isValidPhone, "Số điện thoại không hợp lệ"),
});

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;

export const createAccountDefaultValues: CreateAccountFormValues = {
  username: "",
  email: "",
  password: "",
  systemRole: SYSTEM_ROLES.USER,
  fullName: "",
  phone: "",
};

export function toCreateAccountPayload(
  values: CreateAccountFormValues,
): CreateAccountPayload {
  return {
    username: values.username,
    email: values.email,
    password: values.password,
    systemRole: values.systemRole,
    fullName: values.fullName || undefined,
    phone: values.phone || undefined,
  };
}
