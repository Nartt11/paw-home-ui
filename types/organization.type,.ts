import { baseEntity } from "./core.type";

export interface Organization extends baseEntity {
  organizationId: string;
  name: string;
  description: string;
  type: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  officialLink: string;
  latitude: number;
  longitude: number;
  status: string;
  requestedByUserId: string;
}

export type OrganizationCoreInfo = Pick<
  Organization,
  | "organizationId"
  | "name"
  | "type"
  | "wardName"
  | "provinceName"
  | "status"
  | "streetAddress"
  | "phone"
  | "email"
>;

export interface OrganizationMember extends baseEntity {
  organization_id: string;
  user_id: string;
  role?: string;
  joined_at?: Date;
  status?: string;
}
