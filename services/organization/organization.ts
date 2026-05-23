import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import { PaginatedResponse } from "@/types/api.type";
import type {
  Organization,
  OrganizationListParams,
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
  OrganizationBoundingBoxParams,
  OrganizationSummary,
  OrganizationStatus,
  OrganizationMarkerParams,
} from "@/types/organization.type";

const organizationService = {
  // GET /api/v1/organizations - List all organizations (paginated)
  async getAllOrganizations(
    params: OrganizationListParams,
  ): Promise<PaginatedResponse<OrganizationSummary>> {
    return await http.get<PaginatedResponse<OrganizationSummary>>(
      apiEndpoints.organizations.root,
      {
        params,
      },
    );
  },

  // GET /api/v1/organizations/{id} - Get organization by ID
  async getOrganizationById(id: string): Promise<Organization> {
    return await http.get<Organization>(apiEndpoints.organizations.byId(id));
  },

  // GET /api/v1/organizations/{id}/members - List members of an organization (paginated)
  async getOrganizationMembers(
    id: string,
    params: OrganizationListParams,
  ): Promise<PaginatedResponse<OrganizationSummary>> {
    return await http.get<PaginatedResponse<OrganizationSummary>>(
      apiEndpoints.organizations.members(id),
      { params },
    );
  },

  // POST /api/v1/organizations - Create a new organization
  async createOrganization(
    payload: OrganizationCreatePayload,
  ): Promise<Organization> {
    return await http.post<Organization, OrganizationCreatePayload>(
      apiEndpoints.organizations.root,
      payload,
    );
  },

  // PUT /api/v1/organizations/{id} - Update an existing organization
  async updateOrganization(
    id: string,
    payload: OrganizationUpdatePayload,
  ): Promise<Organization> {
    return await http.put<Organization, OrganizationUpdatePayload>(
      apiEndpoints.organizations.byId(id),
      payload,
    );
  },

  // PATCH /api/v1/organizations/{id}/status - Change organization status (ADMIN only)
  async updateOrganizationStatus(
    id: string,
    status: OrganizationStatus,
  ): Promise<Organization> {
    return await http.patch<Organization, OrganizationStatus>(
      apiEndpoints.organizations.status(id),
      status,
    );
  },

  // DELETE /api/v1/organizations/{id}/members/{userId} - Remove a member from an organization
  async removeMember(id: string, userId: string): Promise<null> {
    const res = await http.delete<null>(
      apiEndpoints.organizations.memberByUser(id, userId),
    );
    return res;
  },

  // DELETE /api/v1/organizations/{id} - Deactivate an organization (soft delete)
  async deactivateOrganization(id: string): Promise<null> {
    const res = await http.delete<null>(apiEndpoints.organizations.byId(id));
    return res;
  },

  // GET /api/v1/organizations/map/bounding-box - Find organizations within bounding box
  async getOrganizationsInBoundingBox(
    params: OrganizationBoundingBoxParams,
  ): Promise<PaginatedResponse<OrganizationSummary>> {
    return await http.get<PaginatedResponse<OrganizationSummary>>(
      apiEndpoints.organizations.map.boundingBox,
      { params },
    );
  },

  // GET /api/v1/organizations/map/markers - Get organization markers in bounding box
  async getOrganizationMapMarkers(
    params: OrganizationMarkerParams,
  ): Promise<Organization[]> {
    return http.get<Organization[]>(apiEndpoints.organizations.map.markers, {
      params,
    });
  },
};

export default organizationService;
