import { baseEntity } from "./core.type";

export interface Role extends baseEntity {
  role_id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Permission {
  permission_id: number;
  resource: string;
  action: string;
  code?: string;
  description?: string;
  created_at: Date;
}

export interface UserRole {
  user_id: string;
  role_id: number;
  assigned_at: Date;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}
