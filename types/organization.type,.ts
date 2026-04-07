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

  location?: any;

  phone?: string;
  email?: string;
  official_link?: string;

  status?: string;
  description?: string;

  requested_by_user_id?: string;
}
