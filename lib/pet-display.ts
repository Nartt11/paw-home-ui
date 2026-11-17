import type {
  PetGender,
  PetHealthStatus,
  PetStatus,
} from "@/types/pet.type";

/** Vietnamese labels for the pet enums the backend sends. Every screen reads them from here. */
export const PET_STATUS_LABEL: Record<PetStatus, string> = {
  AVAILABLE: "Sẵn sàng nhận nuôi",
  FOSTERING: "Đang được chăm sóc",
  ADOPTED: "Đã có gia đình",
  LOST: "Đang thất lạc",
  DECEASED: "Đã mất",
};

/** Soft badge for light backgrounds; text stays at 4.5:1 or more on its tint. */
export const PET_STATUS_BADGE: Record<PetStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-800 hover:bg-emerald-50",
  FOSTERING: "bg-violet-50 text-violet-800 hover:bg-violet-50",
  ADOPTED: "bg-sky-50 text-sky-800 hover:bg-sky-50",
  LOST: "bg-amber-50 text-amber-800 hover:bg-amber-50",
  DECEASED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
};

/** Solid badge for photos and dark backgrounds; white text stays at 4.5:1 or more. */
export const PET_STATUS_BADGE_SOLID: Record<PetStatus, string> = {
  AVAILABLE: "bg-emerald-700 text-white",
  FOSTERING: "bg-violet-700 text-white",
  ADOPTED: "bg-sky-700 text-white",
  LOST: "bg-amber-700 text-white",
  DECEASED: "bg-slate-700 text-white",
};

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

const SPECIES_FALLBACK: Record<string, string> = {
  DOG: "Chó",
  CAT: "Mèo",
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
