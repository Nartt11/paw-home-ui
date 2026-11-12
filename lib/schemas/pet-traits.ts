import { z } from "zod";

import type { PetTraits } from "@/types/pet.type";

// Matches PetTraitsDto. Inputs stay strings so an empty field means "not recorded".
const optionalInt = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+$/.test(v) && +v >= min && +v <= max), message);

const scale = optionalInt(1, 5, "Từ 1 đến 5");

export const PET_SCALE_FIELDS = [
  ["friendlyPeople", "Thân thiện với người"],
  ["friendlyChildren", "Thân thiện với trẻ em"],
  ["goodWithDogs", "Hợp với chó"],
  ["goodWithCats", "Hợp với mèo"],
  ["energy", "Mức năng động"],
  ["fearStrangers", "Sợ người lạ"],
  ["fearNoise", "Sợ tiếng ồn"],
  ["houseTrained", "Đi vệ sinh đúng chỗ"],
  ["noiseLevel", "Mức ồn (sủa/kêu)"],
] as const;

type ScaleField = (typeof PET_SCALE_FIELDS)[number][0];

export const petTraitsSchema = z.object({
  friendlyPeople: scale,
  friendlyChildren: scale,
  goodWithDogs: scale,
  goodWithCats: scale,
  energy: scale,
  fearStrangers: scale,
  fearNoise: scale,
  houseTrained: scale,
  noiseLevel: scale,
  aloneMinutes: optionalInt(0, 1440, "Từ 0 đến 1440 phút"),
  monthlyCost: optionalInt(0, 1_000_000_000, "Số tiền không hợp lệ"),
  biteHistory: z.enum(["", "NONE", "MINOR", "INJURY"]),
  biteVerified: z.boolean(),
  size: z.enum(["", "SMALL", "MEDIUM", "LARGE"]),
  careLevel: z.enum(["", "LOW", "MEDIUM", "HIGH"]),
  sourceRole: z.enum(["FOSTER", "STAFF", "PREVIOUS_OWNER", "OWNER"]),
  note: z.string().trim().max(2000, "Tối đa 2000 ký tự"),
});

export type PetTraitsValues = z.infer<typeof petTraitsSchema>;

const str = (v?: number | null) => (v == null ? "" : String(v));
const num = (v: string) => (v === "" ? null : Number(v));

export function toPetTraitsValues(t?: PetTraits | null): PetTraitsValues {
  const scales = Object.fromEntries(
    PET_SCALE_FIELDS.map(([key]) => [key, str(t?.[key])]),
  ) as Record<ScaleField, string>;
  return {
    ...scales,
    aloneMinutes: str(t?.aloneMinutes),
    monthlyCost: str(t?.monthlyCost),
    biteHistory: t?.biteHistory ?? "",
    biteVerified: t?.biteVerified ?? false,
    size: t?.size ?? "",
    careLevel: t?.careLevel ?? "",
    sourceRole: t?.sourceRole ?? "STAFF",
    note: t?.note ?? "",
  };
}

/** PUT replaces the whole record, so every field is sent. */
export function toPetTraitsPayload(v: PetTraitsValues): PetTraits {
  const scales = Object.fromEntries(
    PET_SCALE_FIELDS.map(([key]) => [key, num(v[key])]),
  ) as Record<ScaleField, number | null>;
  return {
    ...scales,
    aloneMinutes: num(v.aloneMinutes),
    monthlyCost: num(v.monthlyCost),
    biteHistory: v.biteHistory || null,
    biteVerified: v.biteVerified,
    size: v.size || null,
    careLevel: v.careLevel || null,
    sourceRole: v.sourceRole,
    note: v.note || null,
  };
}
