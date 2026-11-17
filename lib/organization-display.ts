import type {
  OrganizationStatus,
  OrganizationType,
} from "@/types/organization.type";

export const ORGANIZATION_TYPE_LABEL: Record<OrganizationType, string> = {
  SHELTER: "Mái ấm",
  VET_CENTER: "Cơ sở thú y",
};

export const ORGANIZATION_STATUS_LABEL: Record<OrganizationStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
  PENDING: "Chờ duyệt",
};

export function organizationTypeLabel(type?: string) {
  return (type && ORGANIZATION_TYPE_LABEL[type as OrganizationType]) || "Tổ chức";
}

export function organizationStatusLabel(status?: string) {
  return (
    (status && ORGANIZATION_STATUS_LABEL[status.toUpperCase() as OrganizationStatus]) ||
    "Chưa rõ"
  );
}
