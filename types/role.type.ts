// RoleSummaryResponseDto
export interface Role {
  roleId: number;
  code: string;
  name: string;
}

export interface RoleListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// CreateRoleRequestDto
export interface RoleCreatePayload {
  code: string;
  name: string;
  description?: string;
}
