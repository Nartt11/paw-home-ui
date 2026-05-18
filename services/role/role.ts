import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity, ListParams, PageDto } from "../api-dto";

export type RoleDto = ApiEntity;
export type PermissionDto = ApiEntity;
export type CreateRolePayload = ApiEntity;
export type AssignPermissionsPayload = ApiEntity;

const roleService = {
  async getAllRoles(params: ListParams): Promise<PageDto<RoleDto>> {
    return http.get<PageDto<RoleDto>>(apiEndpoints.roles.root, { params });
  },

  async getRoleById(id: string | number): Promise<RoleDto> {
    return http.get<RoleDto>(apiEndpoints.roles.byId(id));
  },

  async createRole(payload: CreateRolePayload): Promise<RoleDto> {
    return http.post<RoleDto, CreateRolePayload>(apiEndpoints.roles.root, payload);
  },

  async deleteRole(id: string | number): Promise<void> {
    await http.delete(apiEndpoints.roles.byId(id));
  },

  async getRolePermissions(id: string | number): Promise<PermissionDto[]> {
    return http.get<PermissionDto[]>(apiEndpoints.roles.permissions(id));
  },

  async assignPermissions(
    id: string | number,
    payload: AssignPermissionsPayload,
  ): Promise<RoleDto> {
    return http.post<RoleDto, AssignPermissionsPayload>(
      apiEndpoints.roles.permissions(id),
      payload,
    );
  },
};

export default roleService;
