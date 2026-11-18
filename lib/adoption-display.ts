import type { AdoptionStatus } from "@/types/adoption.type";

/** Vietnamese labels for the backend's AdoptionApplicationStatus. Every screen reads them from here. */
export const ADOPTION_STATUS_LABEL: Record<AdoptionStatus, string> = {
  PENDING: "Chờ xét duyệt",
  APPROVED: "Đã duyệt, chờ đón",
  COMPLETED: "Đã đón về",
  REJECTED: "Từ chối",
  CANCELED: "Đã huỷ",
};

/** Soft badges; text keeps 4.5:1 on its tint. */
export const ADOPTION_STATUS_BADGE: Record<AdoptionStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-50",
  APPROVED: "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-50",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-50",
  CANCELED: "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100",
};

export function adoptionStatusLabel(status?: string) {
  return (status && ADOPTION_STATUS_LABEL[status as AdoptionStatus]) || "Chưa rõ";
}

export function adoptionStatusBadge(status?: string) {
  return (status && ADOPTION_STATUS_BADGE[status as AdoptionStatus]) || ADOPTION_STATUS_BADGE.CANCELED;
}
