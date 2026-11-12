import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";
import type { Role, RoleCreatePayload, RoleListParams } from "@/types/role.type";

const roleService = {
  // GET /api/v1/roles
  async getAllRoles(params: RoleListParams): Promise<PaginatedResponse<Role>> {
    return http.get<PaginatedResponse<Role>>(apiEndpoints.roles.root, { params });
  },

  // POST /api/v1/roles (ADMIN)
  async createRole(payload: RoleCreatePayload): Promise<Role> {
    return http.post<Role, RoleCreatePayload>(apiEndpoints.roles.root, payload);
  },

  // DELETE /api/v1/roles/{id} (ADMIN)
  async deleteRole(id: number): Promise<void> {
    await http.delete(apiEndpoints.roles.byId(id));
  },
};

export default roleService;
