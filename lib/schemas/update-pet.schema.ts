import { z } from "zod";

import type { Pet, PetMedia, PetUpdatePayload } from "@/types/pet.type";

export const PET_UPDATE_GENDER_VALUES = ["MALE", "FEMALE", "UNKNOWN"] as const;
export const PET_UPDATE_HEALTH_STATUS_VALUES = [
  "HEALTHY",
  "UNDER_TREATMENT",
  "RECOVERING",
  "SPECIAL_NEEDS",
] as const;
// PetStatus enum in the backend.
export const PET_UPDATE_STATUS_VALUES = [
  "FOSTERING",
  "AVAILABLE",
  "ADOPTED",
  "LOST",
  "DECEASED",
] as const;

const optionalText = z.string().trim();

export const updatePetSchema = z.object({
  name: z.string().trim().min(1, "Tên thú cưng không được để trống"),
  species: z.string().trim().min(1, "Loài không được để trống"),
  breed: optionalText,
  age: z.coerce.number().min(0, "Tuổi không được nhỏ hơn 0"),
  gender: z.enum(PET_UPDATE_GENDER_VALUES),
  color: optionalText,
  weight: z.coerce
    .number({
      error: "Vui lòng nhập cân nặng",
    })
    .positive("Cân nặng phải lớn hơn 0"),
  description: optionalText,
  status: z.enum(PET_UPDATE_STATUS_VALUES),
  healthStatus: z.enum(PET_UPDATE_HEALTH_STATUS_VALUES),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  imageUrls: z.array(z.string().trim()).default([]),
  mediaIds: z.array(z.string().trim()).default([]),
});

export type UpdatePetFormInput = z.input<typeof updatePetSchema>;
export type UpdatePetFormValues = z.output<typeof updatePetSchema>;

export function createUpdatePetDefaultValues(
  pet: Pet,
  mediaItems: PetMedia[],
): UpdatePetFormInput {
  return {
    name: pet.name || "",
    species: pet.species || "",
    breed: pet.breed || "",
    age: pet.age ?? 0,
    gender: pet.gender,
    color: pet.color || "",
    weight: pet.weight ?? 0,
    description: pet.description || "",
    status: pet.status,
    healthStatus: pet.healthStatus,
    vaccinated: pet.vaccinated,
    neutered: pet.neutered,
    imageUrls: pet.imageUrls ?? [],
    mediaIds: mediaItems.map((item) => item.mediaId),
  };
}

export function toUpdatePetPayload(
  values: UpdatePetFormValues,
): Partial<PetUpdatePayload> {
  return {
    name: values.name.trim(),
    species: values.species.trim(),
    breed: values.breed.trim(),
    age: values.age,
    gender: values.gender,
    color: values.color.trim(),
    weight: values.weight,
    description: values.description.trim(),
    status: values.status,
    healthStatus: values.healthStatus,
    vaccinated: values.vaccinated,
    neutered: values.neutered,
    imageUrls: values.imageUrls,
    mediaIds: values.mediaIds,
  };
}
