import type {
  PetGender,
  PetHealthStatus,
  PetStatus,
} from "@/types/pet.type";
import { STATUS_TONE_SOFT, STATUS_TONE_SOLID, type StatusTone } from "@/lib/status-tone";

/** Vietnamese labels for the pet enums the backend sends. Every screen reads them from here. */
export const PET_STATUS_LABEL: Record<PetStatus, string> = {
  AVAILABLE: "Sẵn sàng nhận nuôi",
  FOSTERING: "Đang được chăm sóc",
  ADOPTED: "Đã có gia đình",
  LOST: "Đang thất lạc",
  DECEASED: "Đã mất",
};

export const PET_STATUS_TONE: Record<PetStatus, StatusTone> = {
  AVAILABLE: "success",
  FOSTERING: "accent",
  ADOPTED: "info",
  LOST: "warning",
  DECEASED: "neutral",
};

const byTone = <K extends string>(tones: Record<K, StatusTone>, classes: Record<StatusTone, string>) =>
  Object.fromEntries(Object.entries(tones).map(([key, tone]) => [key, classes[tone as StatusTone]])) as Record<K, string>;

/** Soft badge for light backgrounds; text stays at 4.5:1 or more on its tint. */
export const PET_STATUS_BADGE = byTone(PET_STATUS_TONE, STATUS_TONE_SOFT);

/** Solid badge for photos and dark backgrounds; white text stays at 4.5:1 or more. */
export const PET_STATUS_BADGE_SOLID = byTone(PET_STATUS_TONE, STATUS_TONE_SOLID);

/** Under treatment needs attention; recovering is in hand; special needs is a trait, not an alarm. */
export const PET_HEALTH_TONE: Record<PetHealthStatus, StatusTone> = {
  HEALTHY: "success",
  UNDER_TREATMENT: "warning",
  RECOVERING: "info",
  SPECIAL_NEEDS: "accent",
};

export const PET_HEALTH_BADGE = byTone(PET_HEALTH_TONE, STATUS_TONE_SOFT);

export const PET_STATUS_OPTIONS = (
  Object.keys(PET_STATUS_LABEL) as PetStatus[]
).map((value) => ({ value, label: PET_STATUS_LABEL[value] }));

/** Only these pets can receive an adoption application. */
export function isAdoptable(status?: string) {
  return status === "AVAILABLE";
}

export const PET_HEALTH_LABEL: Record<PetHealthStatus, string> = {
  HEALTHY: "Khỏe mạnh",
  UNDER_TREATMENT: "Đang điều trị",
  RECOVERING: "Đang hồi phục",
  SPECIAL_NEEDS: "Cần chăm sóc đặc biệt",
};

export const PET_GENDER_LABEL: Record<PetGender, string> = {
  MALE: "Đực",
  FEMALE: "Cái",
  UNKNOWN: "Chưa rõ giới tính",
};

// The backend stores species as the English catalog name (pet_species.name).
const SPECIES_FALLBACK: Record<string, string> = {
  DOG: "Chó",
  CAT: "Mèo",
  RABBIT: "Thỏ",
  HAMSTER: "Chuột Hamster",
  "GUINEA PIG": "Chuột lang",
  BIRD: "Chim",
  FISH: "Cá",
  TURTLE: "Rùa",
  OTHER: "Khác",
};

export function petStatusLabel(status?: string) {
  return (status && PET_STATUS_LABEL[status as PetStatus]) || "Chưa rõ";
}

export function petHealthLabel(status?: string) {
  return (status && PET_HEALTH_LABEL[status as PetHealthStatus]) || "Chưa rõ";
}

export function petGenderLabel(gender?: string) {
  return (gender && PET_GENDER_LABEL[gender as PetGender]) || "Chưa rõ giới tính";
}

/** Prefers the Vietnamese name the backend sends, then a known translation, then the raw name. */
export function speciesLabel(pet: { species?: string; speciesVi?: string }) {
  if (pet.speciesVi) return pet.speciesVi;
  if (!pet.species) return "Thú cưng";
  return SPECIES_FALLBACK[pet.species.toUpperCase()] ?? pet.species;
}

export function breedLabel(pet: { breed?: string; breedVi?: string }) {
  return pet.breedVi || pet.breed || "Chưa rõ giống";
}

/** Age in months, written the way Vietnamese readers say it. */
export function formatPetAge(months?: number | null) {
  if (months == null || Number.isNaN(months)) return "Chưa rõ tuổi";
  if (months < 1) return "Dưới 1 tháng";
  if (months < 12) return `${months} tháng`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} tuổi ${rest} tháng` : `${years} tuổi`;
}
