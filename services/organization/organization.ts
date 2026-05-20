import http from "@/lib/http";
import { mapOrganization, mapOrganizationSummary } from "@/mappers/organition";
import apiEndpoints from "@/services/endpoint";
import type {
  Organization,
  OrganizationMember,
  OrganizationPageModel,
  OrganizationSummary,
} from "@/types/organization.type,.ts";
import {
  AddMemberPayload,
  CreateOrganizationPayload,
  mapOrganizationMember,
  OrganizationDto,
  OrganizationListConfig,
  OrganizationMemberDto,
  OrganizationStatusUpdatePayload,
  OrganizationSummaryDto,
  PageDto,
  UpdateOrganizationPayload,
} from "./organization-dto";
import { mapPage } from "@/mappers/common";

const organizationService = {
  // GET /api/v1/organizations - List all organizations (paginated)
  async getAllOrganizations(
    params: OrganizationListConfig,
  ): Promise<OrganizationPageModel> {
    const dto = await http.get<PageDto<OrganizationSummaryDto>>(
      apiEndpoints.organizations.root,
      {
        params,
      },
    );
    return mapPage(dto, mapOrganizationSummary);
    // return mapPage(dto, mapOrganizationSummary) as OrganizationPageModel;
  },

  // GET /api/v1/organizations/{id} - Get organization by ID
  async getOrganizationById(id: string): Promise<Organization> {
    const dto = await http.get<OrganizationDto>(apiEndpoints.organizations.byId(id));
    return mapOrganization(dto);
  },

  // GET /api/v1/organizations/{id}/members - List members of an organization (paginated)
  async getOrganizationMembers(
    id: string,
    params: OrganizationListConfig,
  ): Promise<PageDto<OrganizationMember>> {
    const dto = await http.get<PageDto<OrganizationMemberDto>>(
      apiEndpoints.organizations.members(id),
      { params },
    );

    return mapPage(dto, mapOrganizationMember);
  },

  // GET /api/v1/organizations/pending - List pending organizations (ADMIN only)
  async getPendingOrganizations(
    params: OrganizationListConfig,
  ): Promise<PageDto<OrganizationSummary>> {
    const dto = await http.get<PageDto<OrganizationSummaryDto>>(
      apiEndpoints.organizations.pending,
      {
        params,
      },
    );

    return mapPage(dto, mapOrganizationSummary);
  },

  // GET /api/v1/organizations/inactive - List inactive organizations (ADMIN only)
  async getInactiveOrganizations(
    params: OrganizationListConfig,
  ): Promise<PageDto<OrganizationSummary>> {
    const dto = await http.get<PageDto<OrganizationSummaryDto>>(
      apiEndpoints.organizations.inactive,
      {
        params,
      },
    );

    return mapPage(dto, mapOrganizationSummary);
  },

  // GET /api/v1/organizations/active - List active organizations (public)
  async getActiveOrganizations(
    params: OrganizationListConfig,
  ): Promise<PageDto<OrganizationSummary>> {
    const dto = await http.get<PageDto<OrganizationSummaryDto>>(
      apiEndpoints.organizations.active,
      {
        params,
      },
    );

    return mapPage(dto, mapOrganizationSummary);
  },

  // POST /api/v1/organizations - Create a new organization
  async createOrganization(
    payload: CreateOrganizationPayload,
  ): Promise<Organization> {
    const dto = await http.post<OrganizationDto, CreateOrganizationPayload>(
      apiEndpoints.organizations.root,
      payload,
    );

    return mapOrganization(dto);
  },

  // PUT /api/v1/organizations/{id} - Update an existing organization
  async updateOrganization(
    id: string,
    payload: UpdateOrganizationPayload,
  ): Promise<Organization> {
    const dto = await http.put<OrganizationDto, UpdateOrganizationPayload>(
      apiEndpoints.organizations.byId(id),
      payload,
    );

    return mapOrganization(dto);
  },

  // PATCH /api/v1/organizations/{id}/status - Change organization status (ADMIN only)
  async updateOrganizationStatus(
    id: string,
    payload: OrganizationStatusUpdatePayload,
  ): Promise<Organization> {
    const dto = await http.patch<
      OrganizationDto,
      OrganizationStatusUpdatePayload
    >(apiEndpoints.organizations.status(id), payload);

    return mapOrganization(dto);
  },

  // POST /api/v1/organizations/{id}/members - Add STAFF or VET to this organization (OWNER only)
  async addMember(
    id: string,
    payload: AddMemberPayload,
  ): Promise<OrganizationMember> {
    const dto = await http.post<OrganizationMemberDto, AddMemberPayload>(
      apiEndpoints.organizations.members(id),
      payload,
    );

    return mapOrganizationMember(dto);
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
    params: Record<string, string | number | undefined>,
  ): Promise<PageDto<OrganizationSummary>> {
    const dto = await http.get<PageDto<OrganizationSummaryDto>>(
      apiEndpoints.organizations.map.boundingBox,
      { params },
    );

    return mapPage(dto, mapOrganizationSummary);
  },

  // GET /api/v1/organizations/map/markers - Get organization markers in bounding box
  async getOrganizationMapMarkers(
    params: Record<string, string | number | undefined>,
  ): Promise<Record<string, unknown>[]> {
    return http.get<Record<string, unknown>[]>(
      apiEndpoints.organizations.map.markers,
      { params },
    );
  },
};

export default organizationService;
