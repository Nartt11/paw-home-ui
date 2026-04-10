import { baseEntity } from "./core.type";

export interface User extends baseEntity {
  user_id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  gender?: string;

  street_address?: string;
  ward_code?: string;
  ward_name?: string;
  province_code?: string;
  province_name?: string;

  status: "PENDING_VERIFICATION" | "ACTIVE" | "DISABLED";
  email_verified: boolean;
}
