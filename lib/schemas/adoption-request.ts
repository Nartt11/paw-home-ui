import { z } from "zod";

/** Where the adopter lives; the backend requires it to match the pet. */
export const HOUSING_OPTIONS = [
  { value: "HOUSE", label: "Nhà riêng" },
  { value: "APARTMENT", label: "Chung cư" },
  { value: "DORMITORY", label: "Ký túc xá, nhà trọ" },
  { value: "FARM", label: "Trang trại, vườn" },
  { value: "OTHER", label: "Khác" },
] as const;

export const adoptionRequestSchema = z.object({
  housingCondition: z.enum(["HOUSE", "APARTMENT", "DORMITORY", "FARM", "OTHER"], {
    message: "Hãy chọn nơi bạn đang ở",
  }),
  experience: z
    .string()
    .trim()
    .min(20, "Hãy mô tả kinh nghiệm chăm sóc tối thiểu 20 ký tự")
    .max(1000, "Nội dung kinh nghiệm không được quá 1000 ký tự"),
  liveCondition: z
    .string()
    .trim()
    .min(20, "Hãy mô tả điều kiện sống tối thiểu 20 ký tự")
    .max(1000, "Nội dung điều kiện sống không được quá 1000 ký tự"),
});

export type AdoptionRequestSchema = z.infer<typeof adoptionRequestSchema>;
