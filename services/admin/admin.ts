import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity } from "../api-dto";
import type {
  AdoptionTrend,
  DashboardPeriodParams,
  PendingTasks,
  RescueSummary,
  SystemDashboardOverview,
  TopOrganizations,
} from "@/types/dashboard.type";
import type { CreateAccountPayload } from "@/types/user.type";

import type { OrganizationAccountValues } from "@/lib/schemas/organization";

export type AdminOrganizationAccountPayload = OrganizationAccountValues;
export type AdminOrganizationMemberPayload = ApiEntity;
export type AdminUserPetPayload = ApiEntity;
export type AdminAccountDto = ApiEntity;

const adminService = {
  async lockUser(userId: string): Promise<void> {
    await http.patch(apiEndpoints.admin.users.lock(userId), {});
  },

  async unlockUser(userId: string): Promise<void> {
    await http.patch(apiEndpoints.admin.users.unlock(userId), {});
  },

  async createAccount(payload: CreateAccountPayload): Promise<AdminAccountDto> {
    return http.post<AdminAccountDto, CreateAccountPayload>(
      apiEndpoints.admin.accounts,
      payload,
    );
  },

  async createOrganizationAccount(
    organizationId: string,
    payload: AdminOrganizationAccountPayload,
  ): Promise<AdminAccountDto> {
    return http.post<AdminAccountDto, AdminOrganizationAccountPayload>(
      apiEndpoints.admin.organizations.accounts(organizationId),
      payload,
    );
  },

  async addOrganizationMember(
    organizationId: string,
    payload: AdminOrganizationMemberPayload,
  ): Promise<ApiEntity> {
    return http.post<ApiEntity, AdminOrganizationMemberPayload>(
      apiEndpoints.admin.organizations.members(organizationId),
      payload,
    );
  },

  async createPetForOrganizationUser(
    organizationId: string,
    userId: string,
    payload: AdminUserPetPayload,
  ): Promise<ApiEntity> {
    return http.post<ApiEntity, AdminUserPetPayload>(
      apiEndpoints.admin.organizations.pets(organizationId),
      payload,
      { params: { userId } },
    );
  },
};

export const adminDashboardService = {
  // GET /api/v1/admin/dashboard/overview - System KPIs for a month
  async getOverview(
    params: DashboardPeriodParams,
  ): Promise<SystemDashboardOverview> {
    return http.get<SystemDashboardOverview>(
      apiEndpoints.admin.dashboard.overview,
      { params },
    );
  },

  // GET /api/v1/admin/dashboard/adoption-trend - Adoptions per month of a year
  async getAdoptionTrend(year: number): Promise<AdoptionTrend> {
    return http.get<AdoptionTrend>(apiEndpoints.admin.dashboard.adoptionTrend, {
      params: { year },
    });
  },

  // GET /api/v1/admin/dashboard/rescue-summary - Rescue cases by status and priority
  async getRescueSummary(params: DashboardPeriodParams): Promise<RescueSummary> {
    return http.get<RescueSummary>(apiEndpoints.admin.dashboard.rescueSummary, {
      params,
    });
  },

  // GET /api/v1/admin/dashboard/top-organizations - Most active organizations
  async getTopOrganizations(
    params: DashboardPeriodParams & { limit?: number },
  ): Promise<TopOrganizations> {
    return http.get<TopOrganizations>(
      apiEndpoints.admin.dashboard.topOrganizations,
      { params },
    );
  },

  // GET /api/v1/admin/dashboard/pending-tasks - Items waiting for an admin
  async getPendingTasks(params: DashboardPeriodParams): Promise<PendingTasks> {
    return http.get<PendingTasks>(apiEndpoints.admin.dashboard.pendingTasks, {
      params,
    });
  },
};

export default adminService;
