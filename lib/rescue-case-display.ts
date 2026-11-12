import type {
  RescueCasePriority,
  RescueCaseStatus,
} from "@/types/rescue-case.type";

/** What the community screens need to show or attach a rescue case, whichever list it came from. */
export interface RescueCaseBrief {
  caseId: string;
  caseCode?: string;
  status?: RescueCaseStatus;
  priority?: RescueCasePriority;
  species?: string;
  locationText?: string;
  imageUrl?: string;
  distanceMeters?: number;
}

export const RESCUE_STATUS_LABEL: Record<RescueCaseStatus, string> = {
  REPORTED: "Đang chờ giúp",
  IN_PROGRESS: "Đang được cứu",
  RESCUED: "Đã cứu",
  CLOSED: "Đã đóng",
};

export const RESCUE_PRIORITY_LABEL: Record<RescueCasePriority, string> = {
  CRITICAL: "Khẩn cấp",
  HIGH: "Cao",
  NORMAL: "Bình thường",
  LOW: "Thấp",
};

export const OPEN_RESCUE_STATUSES: RescueCaseStatus[] = ["REPORTED", "IN_PROGRESS"];

export function isOpenRescueStatus(status?: RescueCaseStatus) {
  return !!status && OPEN_RESCUE_STATUSES.includes(status);
}

export function formatDistance(meters?: number) {
  if (meters == null) return undefined;
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

/** A first draft for a post about a case; the author edits it before posting. */
export function draftPostAboutCase(rescueCase: RescueCaseBrief) {
  const subject = rescueCase.species?.trim() || "một bé";
  const place = rescueCase.locationText?.trim();
  return `Cần giúp đỡ: ${subject}${place ? ` tại ${place}` : ""}. Ai ở gần xin giúp một tay!`;
}

export function formatRelativeTime(iso?: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}
