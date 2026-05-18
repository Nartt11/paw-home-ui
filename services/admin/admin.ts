import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity } from "../api-dto";

export type AdminAccountPayload = ApiEntity;
export type AdminOrganizationAccountPayload = ApiEntity;
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

  async createAccount(payload: AdminAccountPayload): Promise<AdminAccountDto> {
    return http.post<AdminAccountDto, AdminAccountPayload>(
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
      apiEndpoints.admin.organizations.userPets(organizationId, userId),
      payload,
    );
  },
};

export default adminService;
