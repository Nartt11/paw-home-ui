import { z } from "zod";

// Matches CreateRoleRequestDto / CreateTagRequestDto in the backend.
export const catalogItemSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã")
    .max(50, "Mã tối đa 50 ký tự"),
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên")
    .max(100, "Tên tối đa 100 ký tự"),
  description: z.string().trim().max(500, "Mô tả tối đa 500 ký tự"),
});

export type CatalogItemValues = z.infer<typeof catalogItemSchema>;

export const catalogItemDefaultValues: CatalogItemValues = {
  code: "",
  name: "",
  description: "",
};
