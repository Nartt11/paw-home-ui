import { z } from "zod";

export const ACCEPTED_PET_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_PET_IMAGE_SIZE = 5 * 1024 * 1024;
const PET_GENDER_VALUES = ["MALE", "FEMALE", "UNKNOWN"] as const;

const optionalText = z.string().trim();

export const createPetSchema = z.object({
  name: z.string().trim().min(1, "Tên thú cưng không được để trống"),
  species: z.string().trim().min(1, "Loài không được để trống"),
  breed: optionalText,
  age: z.coerce.number().min(0, "Tuổi không được nhỏ hơn 0"),
  gender: z.enum(PET_GENDER_VALUES),
  color: optionalText,
  weight: z.coerce.number().min(0, "Cân nặng không được nhỏ hơn 0"),
  description: optionalText,
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  rescueDate: z.string(),
  rescueLocation: optionalText,
  imageUrls: z
    .array(z.string().trim().url("Ảnh tải lên không hợp lệ"))
    .min(1, "Vui lòng tải lên ít nhất 1 ảnh"),
  shelterId: z.string().trim().min(1, "Shelter ID không được để trống"),
  rescueCaseId: optionalText,
});

export type CreatePetFormValues = z.infer<typeof createPetSchema>;

export const createPetDefaultValues: CreatePetFormValues = {
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
  rescueDate: "",
  rescueLocation: "",
  imageUrls: [],
  shelterId: "",
  rescueCaseId: "",
};
