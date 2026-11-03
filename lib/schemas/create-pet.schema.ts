import type { PetCreatePayload } from "@/types/pet.type";
import { z } from "zod";

export const ACCEPTED_PET_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_PET_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_PET_IMAGES = 10;
const PET_GENDER_VALUES = ["MALE", "FEMALE", "UNKNOWN"] as const;
export const PET_HEALTH_STATUS_VALUES = [
  "HEALTHY",
  "UNDER_TREATMENT",
  "RECOVERING",
  "SPECIAL_NEEDS",
] as const;

export const createPetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên thú cưng không được để trống")
    .max(100, "Tên thú cưng không được vượt quá 100 ký tự"),
  speciesId: z.string().min(1, "Vui lòng chọn loài"),
  breedId: z.string(),
  age: z.coerce
    .number()
    .min(0, "Tuổi không được nhỏ hơn 0")
    .max(6000, "Tuổi không được vượt quá 6000"),
  gender: z.enum(PET_GENDER_VALUES),
  color: z.string().trim().max(50, "Màu sắc không được vượt quá 50 ký tự"),
  weight: z.coerce
    .number({
      error: "Vui lòng nhập cân nặng",
    })
    .positive("Cân nặng phải lớn hơn 0")
    .max(500, "Cân nặng không được vượt quá 500kg"),
  description: z
    .string()
    .trim()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự"),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  healthStatus: z.enum(PET_HEALTH_STATUS_VALUES),
  // imageUrls chỉ dùng để xem trước, backend nhận ảnh qua mediaIds
  imageUrls: z
    .array(z.string().trim().url("Ảnh tải lên không hợp lệ"))
    .min(1, "Vui lòng tải lên ít nhất 1 ảnh")
    .max(MAX_PET_IMAGES, `Chỉ được tải lên tối đa ${MAX_PET_IMAGES} ảnh`),
  mediaIds: z.array(z.string().trim()).default([]),
  shelterId: z.string().min(1, "Vui lòng chọn trung tâm"),
  rescueCaseId: z.string(),
});

export type CreatePetFormInput = z.input<typeof createPetSchema>;
export type CreatePetFormValues = z.output<typeof createPetSchema>;

export const createPetDefaultValues: CreatePetFormInput = {
  name: "",
  speciesId: "",
  breedId: "",
  age: 0,
  gender: "UNKNOWN",
  color: "",
  weight: 0,
  description: "",
  vaccinated: false,
  neutered: false,
  healthStatus: "HEALTHY",
  imageUrls: [],
  mediaIds: [],
  shelterId: "",
  rescueCaseId: "",
};

export function toCreatePetPayload(
  values: CreatePetFormValues,
): Partial<PetCreatePayload> {
  return {
    name: values.name,
    speciesId: values.speciesId,
    breedId: values.breedId || undefined,
    age: values.age,
    gender: values.gender,
    color: values.color,
    weight: values.weight,
    description: values.description,
    vaccinated: values.vaccinated,
    neutered: values.neutered,
    healthStatus: values.healthStatus,
    mediaIds: values.mediaIds,
    shelterId: values.shelterId,
    rescueCaseId: values.rescueCaseId || undefined,
  };
}
