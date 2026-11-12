import type { LucideIcon } from "lucide-react";
import { History, Image as ImageIcon, Stethoscope } from "lucide-react";

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

export const PET_STATUS_LABELS: Record<PetStatus, string> = {
  AVAILABLE: "Sẵn sàng nhận nuôi",
  LOST: "Thất lạc",
  ADOPTED: "Đã nhận nuôi",
  FOSTERING: "Đang foster",
  DECEASED: "Đã mất",
};

export const PET_STATUS_BADGE_CLASSNAMES: Record<PetStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  LOST: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  ADOPTED: "bg-sky-50 text-sky-700 hover:bg-sky-50",
  FOSTERING: "bg-violet-50 text-violet-700 hover:bg-violet-50",
  DECEASED: "bg-muted text-muted-foreground hover:bg-muted",
};

export const PET_HEALTH_LABELS: Record<PetHealthStatus, string> = {
  HEALTHY: "Khỏe mạnh",
  UNDER_TREATMENT: "Đang điều trị",
  RECOVERING: "Đang hồi phục",
  SPECIAL_NEEDS: "Cần chăm sóc đặc biệt",
};

export const PET_HEALTH_BADGE_CLASSNAMES: Record<PetHealthStatus, string> = {
  HEALTHY: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  UNDER_TREATMENT: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  RECOVERING: "bg-sky-50 text-sky-700 hover:bg-sky-50",
  SPECIAL_NEEDS: "bg-rose-50 text-rose-700 hover:bg-rose-50",
};

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
