import { z } from "zod";

import { isValidPhone } from "@/lib/schemas/user";
import type {
  Organization,
  OrganizationCreatePayload,
} from "@/types/organization.type";

export const ORGANIZATION_TYPE_VALUES = ["SHELTER", "VET_CENTER"] as const;

const MISSING_COORDINATE = "Vui lòng chọn vị trí trên bản đồ";

export const organizationFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên trung tâm không được để trống")
    .max(255, "Tên trung tâm không được vượt quá 255 ký tự"),
  type: z.enum(ORGANIZATION_TYPE_VALUES),
  description: z
    .string()
    .trim()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự"),
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .refine(isValidPhone, "Số điện thoại không hợp lệ"),
  officialLink: z
    .string()
    .trim()
    .max(500, "Liên kết không được vượt quá 500 ký tự"),
  streetAddress: z
    .string()
    .trim()
    .min(1, "Địa chỉ không được để trống")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
  provinceCode: z.string().min(1, "Vui lòng chọn tỉnh / thành phố"),
  provinceName: z.string(),
  wardCode: z.string().min(1, "Vui lòng chọn phường / xã"),
  wardName: z.string(),
  latitude: z.number({ error: MISSING_COORDINATE }),
  longitude: z.number({ error: MISSING_COORDINATE }),
});

export type OrganizationFormInput = z.input<typeof organizationFormSchema>;
export type OrganizationFormValues = z.output<typeof organizationFormSchema>;

export const organizationFormDefaultValues: Partial<OrganizationFormInput> = {
  name: "",
  type: "SHELTER",
  description: "",
  email: "",
  phone: "",
  officialLink: "",
  streetAddress: "",
  provinceCode: "",
  provinceName: "",
  wardCode: "",
  wardName: "",
  latitude: undefined,
  longitude: undefined,
};

export function toOrganizationFormValues(
  organization: Organization,
): Partial<OrganizationFormInput> {
  return {
    name: organization.name ?? "",
    type: organization.type ?? "SHELTER",
    description: organization.description ?? "",
    email: organization.email ?? "",
    phone: organization.phone ?? "",
    officialLink: organization.officialLink ?? "",
    streetAddress: organization.streetAddress ?? "",
    provinceCode: organization.provinceCode ?? "",
    provinceName: organization.provinceName ?? "",
    wardCode: organization.wardCode ?? "",
    wardName: organization.wardName ?? "",
    latitude: organization.latitude ?? undefined,
    longitude: organization.longitude ?? undefined,
  };
}

export function toOrganizationPayload(
  values: OrganizationFormValues,
): OrganizationCreatePayload {
  return { ...values };
}

// CreateOrganizationAccountRequestDto (POST /admin/organizations/{id}/accounts)
export const ORGANIZATION_ACCOUNT_ROLES = ["OWNER", "STAFF", "MEMBER", "VET"] as const;

export const ORGANIZATION_ROLE_LABEL: Record<(typeof ORGANIZATION_ACCOUNT_ROLES)[number], string> = {
  OWNER: "Chủ trạm",
  STAFF: "Nhân viên",
  MEMBER: "Thành viên",
  VET: "Bác sĩ thú y",
};

export const organizationAccountSchema = z.object({
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
  organizationRole: z.enum(ORGANIZATION_ACCOUNT_ROLES),
});

export type OrganizationAccountValues = z.infer<typeof organizationAccountSchema>;

export const organizationAccountDefaultValues: OrganizationAccountValues = {
  username: "",
  email: "",
  password: "",
  organizationRole: "STAFF",
};
