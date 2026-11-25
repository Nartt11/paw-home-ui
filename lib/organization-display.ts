import type {
  OrganizationStatus,
  OrganizationType,
} from "@/types/organization.type";
import { STATUS_TONE_SOFT, type StatusTone } from "@/lib/status-tone";

export const ORGANIZATION_TYPE_LABEL: Record<OrganizationType, string> = {
  SHELTER: "Mái ấm",
  VET_CENTER: "Cơ sở thú y",
};

export const ORGANIZATION_STATUS_LABEL: Record<OrganizationStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
  PENDING: "Chờ duyệt",
  REJECTED: "Bị từ chối",
};

export const ORGANIZATION_STATUS_TONE: Record<OrganizationStatus, StatusTone> = {
  ACTIVE: "success",
  PENDING: "warning",
  REJECTED: "danger",
  INACTIVE: "neutral",
};

export function organizationStatusBadge(status?: string) {
  return STATUS_TONE_SOFT[(status && ORGANIZATION_STATUS_TONE[status.toUpperCase() as OrganizationStatus]) || "neutral"];
}

export const ORGANIZATION_ROLE_LABEL: Record<string, string> = {
  OWNER: "Chủ sở hữu",
  STAFF: "Nhân viên",
  VET: "Bác sĩ thú y",
  MEMBER: "Thành viên",
};

/** A role is who someone is, not a state: only the owner stands out, never in a status colour. */
export function organizationRoleBadge(role?: string) {
  return STATUS_TONE_SOFT[role?.toUpperCase() === "OWNER" ? "accent" : "neutral"];
}

export function organizationRoleLabel(role?: string) {
  return (role && ORGANIZATION_ROLE_LABEL[role.toUpperCase()]) || role || "Thành viên";
}

export function organizationTypeLabel(type?: string) {
  return (type && ORGANIZATION_TYPE_LABEL[type as OrganizationType]) || "Tổ chức";
}

export function organizationStatusLabel(status?: string) {
  return (
    (status && ORGANIZATION_STATUS_LABEL[status.toUpperCase() as OrganizationStatus]) ||
    "Chưa rõ"
  );
}
