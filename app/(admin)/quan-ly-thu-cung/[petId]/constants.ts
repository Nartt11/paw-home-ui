import type { LucideIcon } from "lucide-react";
import { History, Image as ImageIcon, Stethoscope } from "lucide-react";

import { PET_STATUS_BADGE, PET_STATUS_LABEL } from "@/lib/pet-display";
import type { PetHealthStatus, PetStatus } from "@/types/pet.type";

export const PET_DETAIL_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600";

export const PET_DETAIL_SECTION_QUERY = {
  page: 0,
  pageSize: 10,
} as const;

export const PET_DETAIL_MEDIA_QUERY = {
  page: 0,
  pageSize: 8,
} as const;

export const PET_GENDER_LABELS: Record<string, string> = {
  MALE: "Đực",
  FEMALE: "Cái",
  UNKNOWN: "Chưa rõ",
};

export const PET_STATUS_LABELS: Record<PetStatus, string> = PET_STATUS_LABEL;

export const PET_STATUS_BADGE_CLASSNAMES: Record<PetStatus, string> =
  PET_STATUS_BADGE;

// One source for health labels and colours, shared with the pet list.
export {
  PET_HEALTH_LABEL as PET_HEALTH_LABELS,
  PET_HEALTH_BADGE as PET_HEALTH_BADGE_CLASSNAMES,
} from "@/lib/pet-display";

export const PET_DETAIL_TABS: Array<{
  value: "medical" | "media" | "logs";
  label: string;
  icon: LucideIcon;
}> = [
  {
    value: "medical",
    label: "Hồ sơ y tế",
    icon: Stethoscope,
  },
  {
    value: "media",
    label: "Hình ảnh",
    icon: ImageIcon,
  },
  {
    value: "logs",
    label: "Hoạt động",
    icon: History,
  },
];
