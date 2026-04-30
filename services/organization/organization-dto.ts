import { Organization, OrganizationMember } from "@/types/organization.type,";

export interface OrganizationListConfig {
  status?: string; // pending, active, inactive
  page?: number;
  size?: number;
}

export interface OrganizationStatusUpdatePayload {
  status: string;
}

export type CreateOrganizationPayload = Partial<Organization>;
export type UpdateOrganizationPayload = Partial<Organization>;

export interface AddMemberPayload {
  user_id: string;
  role?: string; // STAFF, VET, ...
}

// =====================
// DTOs
// =====================

export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface OrganizationSummaryDto {
  organizationId: string;
  name: string;
  type: "SHELTER" | "VET_CENTER";
  status: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
}

export interface OrganizationDto {
  organizationId: string;
  name: string;
  description: string;
  type: "SHELTER" | "VET_CENTER";
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  officialLink: string;
  latitude: number;
  longitude: number;
  status: string;
  requestedByUserId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMemberDto {
  userId: string;
  organizationId: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export function mapOrganizationMember(
  dto: OrganizationMemberDto,
): OrganizationMember {
  // map tối thiểu, tránh leak DTO ra ngoài service
  return {
    userId: dto.userId,
    organizationId: dto.organizationId,
    role: dto.role,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  } as unknown as OrganizationMember;
}

export function mapPage<TDto, TModel>(
  dto: PageDto<TDto>,
  mapItem: (x: TDto) => TModel,
) {
  return {
    content: dto.content.map(mapItem),
    page: dto.page,
    size: dto.size,
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
    last: dto.last,
  };
}
