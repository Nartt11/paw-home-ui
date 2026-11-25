import type {
  RescueCasePriority,
  RescueCaseStatus,
  RescueCaseType,
  RescueClaimReleaseReason,
  RescueCompletionStatus,
  RescueOutcome,
} from "@/types/rescue-case.type";
import { STATUS_TONE_SOFT, type StatusTone } from "@/lib/status-tone";

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

/** waiting for help, someone on it, done, closed */
export const RESCUE_STATUS_TONE: Record<RescueCaseStatus, StatusTone> = {
  REPORTED: "warning",
  IN_PROGRESS: "info",
  RESCUED: "success",
  CLOSED: "neutral",
};

/** Only the two urgent levels get a colour; the ordinary ones stay quiet. */
export const RESCUE_PRIORITY_TONE: Record<RescueCasePriority, StatusTone> = {
  CRITICAL: "danger",
  HIGH: "serious",
  NORMAL: "neutral",
  LOW: "neutral",
};

export function rescueStatusBadge(status?: string) {
  return STATUS_TONE_SOFT[(status && RESCUE_STATUS_TONE[status as RescueCaseStatus]) || "neutral"];
}

export function rescuePriorityBadge(priority?: string) {
  return STATUS_TONE_SOFT[(priority && RESCUE_PRIORITY_TONE[priority as RescueCasePriority]) || "neutral"];
}

export const RESCUE_PRIORITY_LABEL: Record<RescueCasePriority, string> = {
  CRITICAL: "Khẩn cấp",
  HIGH: "Cao",
  NORMAL: "Bình thường",
  LOW: "Thấp",
};

export const RESCUE_CASE_TYPE_LABEL: Record<RescueCaseType, string> = {
  RESCUE: "Cứu hộ",
  LOST: "Thú đi lạc",
  FOUND: "Nhặt được thú",
};

/** What happened to the animal, as the rescuer reports it. */
export const RESCUE_OUTCOME_LABEL: Record<RescueOutcome, string> = {
  HANDED_TO_ORG: "Đã giao cho tổ chức",
  TEMP_HOLDING: "Đang giữ tạm",
  KEPT_BY_RESCUER: "Tôi sẽ nuôi bé",
  RELEASED: "Đã thả về chỗ cũ",
  DECEASED: "Bé đã mất",
};

export const RESCUE_COMPLETION_STATUS_LABEL: Record<RescueCompletionStatus, string> = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Đã xác nhận",
  REJECTED: "Bị từ chối",
  DISPUTED: "Người báo không đồng ý",
};

export const RESCUE_COMPLETION_STATUS_TONE: Record<RescueCompletionStatus, StatusTone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  DISPUTED: "serious",
};

export const RESCUE_RELEASE_REASON_LABEL: Record<RescueClaimReleaseReason, string> = {
  GAVE_UP: "Tôi không đi được nữa",
  NEED_HELP: "Tôi cần người hỗ trợ",
  NOT_FOUND: "Đến nơi nhưng không thấy bé",
  CASE_ENDED: "Ca đã kết thúc",
};

/** The reasons a person can pick when giving a case back. */
export const RELEASE_REASON_CHOICES: RescueClaimReleaseReason[] = ["GAVE_UP", "NEED_HELP", "NOT_FOUND"];

export function rescueStatusLabel(status?: string) {
  return (status && RESCUE_STATUS_LABEL[status as RescueCaseStatus]) || "Chưa rõ";
}

export function rescuePriorityLabel(priority?: string) {
  return (priority && RESCUE_PRIORITY_LABEL[priority as RescueCasePriority]) || "Chưa rõ";
}

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

/** Kept here so existing imports keep working. */
export { formatRelativeTime } from "@/lib/datetime";
