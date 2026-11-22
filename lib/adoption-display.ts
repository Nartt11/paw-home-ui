import type { AdoptionStatus } from "@/types/adoption.type";
import { STATUS_TONE_SOFT, type StatusTone } from "@/lib/status-tone";

/** Vietnamese labels for the backend's AdoptionApplicationStatus. Every screen reads them from here. */
export const ADOPTION_STATUS_LABEL: Record<AdoptionStatus, string> = {
  PENDING: "Chờ xét duyệt",
  APPROVED: "Đã duyệt, chờ đón",
  COMPLETED: "Đã đón về",
  REJECTED: "Từ chối",
  CANCELED: "Đã huỷ",
};

/** Same meaning as the dashboard chart: amber waiting, blue approved, green done, red refused. */
export const ADOPTION_STATUS_TONE: Record<AdoptionStatus, StatusTone> = {
  PENDING: "warning",
  APPROVED: "info",
  COMPLETED: "success",
  REJECTED: "danger",
  CANCELED: "neutral",
};

export const ADOPTION_STATUS_BADGE = Object.fromEntries(
  Object.entries(ADOPTION_STATUS_TONE).map(([status, tone]) => [status, STATUS_TONE_SOFT[tone]]),
) as Record<AdoptionStatus, string>;

export function adoptionStatusLabel(status?: string) {
  return (status && ADOPTION_STATUS_LABEL[status as AdoptionStatus]) || "Chưa rõ";
}

export function adoptionStatusBadge(status?: string) {
  return (status && ADOPTION_STATUS_BADGE[status as AdoptionStatus]) || ADOPTION_STATUS_BADGE.CANCELED;
}
