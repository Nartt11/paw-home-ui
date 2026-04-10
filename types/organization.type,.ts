import { baseEntity } from "./core.type";

export interface Organization extends baseEntity {
  organization_id: string;
  name?: string;
  type?: string;

  street_address?: string;
  province_code?: string;
  province_name?: string;
  ward_code?: string;
  ward_name?: string;

  location?: string;

  phone?: string;
  email?: string;
  official_link?: string;

  status?: string;
  description?: string;

  requested_by_user_id?: string;
}

export interface OrganizationMember extends baseEntity {
  organization_id: string;
  user_id: string;
  role?: string;
  joined_at?: Date;
  status?: string;
}
