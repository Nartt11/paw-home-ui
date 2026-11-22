import type { UserStatus } from "@/types/user.type";
import { STATUS_TONE_SOFT, type StatusTone } from "@/lib/status-tone";

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "Hoạt động",
  PENDING_VERIFICATION: "Chờ xác minh email",
  LOCKED: "Đã khóa",
  BANNED: "Bị cấm",
  INACTIVE: "Ngừng hoạt động",
};

export const USER_STATUS_TONE: Record<UserStatus, StatusTone> = {
  ACTIVE: "success",
  PENDING_VERIFICATION: "warning",
  LOCKED: "danger",
  BANNED: "danger",
  INACTIVE: "neutral",
};

export function userStatusLabel(status?: string) {
  return (status && USER_STATUS_LABEL[status as UserStatus]) || status || "Không rõ";
}

export function userStatusBadge(status?: string) {
  return STATUS_TONE_SOFT[(status && USER_STATUS_TONE[status as UserStatus]) || "neutral"];
}
