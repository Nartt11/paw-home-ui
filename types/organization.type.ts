import { ListParams } from "./api.type";

export type OrganizationType = "SHELTER" | "VET_CENTER";
export type OrganizationStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export interface OrganizationSummary {
  organizationId: string;
  name: string;
  type: OrganizationType;
  status: OrganizationStatus;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  organizationCode: string;
  imageUrl: string;
}

export interface OrganizationListParams {
  status?: string[];
  page?: number;
  size?: number;
}
export interface Organization extends OrganizationSummary {
  description: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  imageUrl: string;
  officialLink: string;
  latitude: number;
  longitude: number;
  requestedByUserId: string;
  requestedByUsername: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role?: string;
  joined_at?: Date;
  status?: string;
}

export interface OrganizationCreatePayload {
  name: string;
  description: string;
  type: string;
  streetAddress: string;
  wardCode: string;
  wardName: string;
  provinceCode: string;
  provinceName: string;
  phone: string;
  email: string;
  imageUrl: string;
  officialLink: string;
  latitude: number;
  longitude: number;
}
export interface OrganizationUpdatePayload {
  name: string;
  description: string;
  type: OrganizationType;
  streetAddress: string;
  wardCode: string;
  wardName: string;
  provinceCode: string;
  provinceName: string;
  phone: string;
  email: string;
  imageUrl: string;
  officialLink: string;
  latitude: number;
  longitude: number;
}
export interface OrganizationMarkerParams { 
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  status?: OrganizationStatus[];
  type?: OrganizationType[];
}

export interface OrganizationBoundingBoxParams extends ListParams {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  status?: OrganizationStatus[];
}
