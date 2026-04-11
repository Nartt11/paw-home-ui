import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import {
  Organization,
  OrganizationCoreInfo,
  OrganizationMember,
} from "@/types/organization.type,";

export interface OrganizationListConfig {
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

const organizationService = {
  // GET /api/v1/organizations - List all organizations (paginated)
  getAllOrganizations(params: OrganizationListConfig) {
    return http.get<BaseResponse<PaginatedResponse<OrganizationCoreInfo>>>(
      "/organizations",
      { params },
    );
  },

  // GET /api/v1/organizations/{id} - Get organization by ID
  getOrganizationById(id: string) {
    return http.get<BaseResponse<Organization>>(`/organizations/${id}`);
  },

  // GET /api/v1/organizations/{id}/members - List members of an organization (paginated)
  getOrganizationMembers(id: string, params: OrganizationListConfig) {
    return http.get<BaseResponse<PaginatedResponse<OrganizationMember>>>(
      `/organizations/${id}/members`,
      { params },
    );
  },

  // GET /api/v1/organizations/pending - List pending organizations (ADMIN only)
  getPendingOrganizations(params: OrganizationListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Organization>>>(
      "/organizations/pending",
      { params },
    );
  },

  // GET /api/v1/organizations/inactive - List inactive organizations (ADMIN only)
  getInactiveOrganizations(params: OrganizationListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Organization>>>(
      "/organizations/inactive",
      { params },
    );
  },

  // GET /api/v1/organizations/active - List active organizations (public)
  getActiveOrganizations(params: OrganizationListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Organization>>>(
      "/organizations/active",
      { params },
    );
  },

  // POST /api/v1/organizations - Create a new organization
  createOrganization(payload: CreateOrganizationPayload) {
    return http.post<BaseResponse<Organization>>("/organizations", payload);
  },

  // PUT /api/v1/organizations/{id} - Update an existing organization
  updateOrganization(id: string, payload: UpdateOrganizationPayload) {
    return http.put<BaseResponse<Organization>>(
      `/organizations/${id}`,
      payload,
    );
  },

  // PATCH /api/v1/organizations/{id}/status - Change organization status (ADMIN only)
  updateOrganizationStatus(
    id: string,
    payload: OrganizationStatusUpdatePayload,
  ) {
    return http.patch<BaseResponse<Organization>>(
      `/organizations/${id}/status`,
      payload,
    );
  },

  // POST /api/v1/organizations/{id}/members - Add STAFF or VET to this organization (OWNER only)
  addMember(id: string, payload: AddMemberPayload) {
    return http.post<BaseResponse<OrganizationMember>>(
      `/organizations/${id}/members`,
      payload,
    );
  },

  // DELETE /api/v1/organizations/{id}/members/{userId} - Remove a member from an organization
  removeMember(id: string, userId: string) {
    return http.delete<BaseResponse<null>>(
      `/organizations/${id}/members/${userId}`,
    );
  },

  // DELETE /api/v1/organizations/{id} - Deactivate an organization (soft delete)
  deactivateOrganization(id: string) {
    return http.delete<BaseResponse<null>>(`/organizations/${id}`);
  },
};

export default organizationService;
