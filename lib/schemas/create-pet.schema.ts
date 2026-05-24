import type { PetCreatePayload } from "@/types/pet.type";
import { z } from "zod";

export const ACCEPTED_PET_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_PET_IMAGE_SIZE = 5 * 1024 * 1024;
const PET_GENDER_VALUES = ["MALE", "FEMALE", "UNKNOWN"] as const;
export const PET_HEALTH_STATUS_VALUES = [
  "HEALTHY",
  "UNDER_TREATMENT",
  "RECOVERING",
  "SPECIAL_NEEDS",
] as const;

const optionalText = z.string().trim();

export const createPetSchema = z.object({
  name: z.string().trim().min(1, "Tên thú cưng không được để trống"),
  species: z.string().trim().min(1, "Loài không được để trống"),
  breed: optionalText,
  age: z.coerce.number().min(0, "Tuổi không được nhỏ hơn 0"),
  gender: z.enum(PET_GENDER_VALUES),
  color: optionalText,
  weight: z.coerce
    .number({
      error: "Vui lòng nhập cân nặng",
    })
    .positive("Cân nặng phải lớn hơn 0"),
  description: optionalText,
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  healthStatus: z.enum(PET_HEALTH_STATUS_VALUES),
  rescueDate: z.string(),
  rescueLocation: optionalText,
  imageUrls: z
    .array(z.string().trim().url("Ảnh tải lên không hợp lệ"))
    .min(1, "Vui lòng tải lên ít nhất 1 ảnh"),
  mediaIds: z.array(z.string().trim()).default([]),
  shelterId: z.string(),
  rescueCaseId: optionalText,
});

export type CreatePetFormInput = z.input<typeof createPetSchema>;
export type CreatePetFormValues = z.output<typeof createPetSchema>;

export const createPetDefaultValues: CreatePetFormInput = {
  name: "",
  species: "",
  breed: "",
  age: 0,
  gender: "UNKNOWN",
  color: "",
  weight: 0,
  description: "",
  vaccinated: false,
  neutered: false,
  healthStatus: "HEALTHY",
  rescueDate: "",
  rescueLocation: "",
  imageUrls: [],
  mediaIds: [],
  shelterId: "",
  rescueCaseId: "",
};

export function toCreatePetPayload(
  values: CreatePetFormValues,
): Partial<PetCreatePayload> {
  return {
    name: values.name.trim(),
    species: values.species.trim(),
    breed: values.breed.trim(),
    age: values.age,
    gender: values.gender,
    color: values.color.trim(),
    weight: values.weight,
    description: values.description.trim(),
    vaccinated: values.vaccinated,
    neutered: values.neutered,
    healthStatus: values.healthStatus,
    rescueDate: values.rescueDate,
    rescueLocation: values.rescueLocation.trim(),
    imageUrls: values.imageUrls,
    mediaIds: values.mediaIds,
    shelterId: values.shelterId.trim(),
    rescueCaseId: values.rescueCaseId.trim() || undefined,
  };
}
